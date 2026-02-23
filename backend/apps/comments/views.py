from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from apps.users.models import User




class CommentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        # 記事取得
        post = Post.objects.filter(post_id=post_id, is_deleted=False, post_user__is_stopped=False ).first()
        if not post:
            return Response({"error": "記事が存在しません"}, status=404)

        # コメント取得（親コメントのみ）
        comments = Comment.objects.filter(post=post, parent_comment__isnull=True, is_deleted=False, user__is_stopped=False ).order_by("created_at")

        serializer = CommentSerializer(comments, many=True, context={"request": request})
        return Response(serializer.data)
    


# コメントいいねボタン
class CommentLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, comment_id):
        # コメント取得
        comment = Comment.objects.filter(comment_id=comment_id, is_deleted=False).first()
        
        # コメントなかったら
        if not comment:
            return Response({"error": "コメントが存在しません"}, status=status.HTTP_404_NOT_FOUND)
        
        user = request.user

        # いいねしてるか取得
        like = CommentLike.objects.filter(comment=comment, user=user).first()

        if like:
            # いいね取り消し
            like.delete()
            liked = False
        else:
            # いいね追加
            CommentLike.objects.create(comment=comment, user=user)
            liked = True

        # いいね数取得
        like_count = CommentLike.objects.filter(comment=comment).count()

        return Response({
            "liked": liked,
            "like_count": like_count
        })
        
        

# ModerationAPIでバリデーションチェック
import requests
from django.conf import settings
from django.core.cache import cache
import hashlib        
# コメント作成
class CommentCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    # post送信
    def post(self, request, post_id):
        # 記事を取得
        post = Post.objects.filter(post_id=post_id, is_deleted=False).first()
        
        if not post:
            return Response({"error": "記事が存在しません"}, status=status.HTTP_404_NOT_FOUND)
        
        content = request.data.get("content")
        parent_comment_id = request.data.get("parent_comment")   # 子コメント用
        
        if not content:
            return Response({"error" : "コメントを入力してください"}, status=status.HTTP_400_BAD_REQUEST)
        
        # ここからModerationAPIバリデーション
        # キャッシュキー作成
        cache_key = "moderation_comment_" + hashlib.sha256(
            content.encode()
        ).hexdigest()

        cached_flag = cache.get(cache_key)

        if cached_flag is not None:
            flagged = cached_flag
        else:
            flagged = False
            try:
                response = requests.post(
                    "https://api.openai.com/v1/moderations",
                    headers={
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
                    },
                    json={
                        "model": "omni-moderation-latest",
                        "input": content
                    },
                    timeout=5
                )

                response.raise_for_status()
                moderation_result = response.json()

                flagged = False

                if "results" in moderation_result and len(moderation_result["results"]) > 0:
                    flagged = moderation_result["results"][0].get("flagged", False)

                # 5分キャッシュ
                cache.set(cache_key, flagged, timeout=60 * 5)

            except Exception as e:
                return Response(
                    {"error": "AIチェックに失敗しました。しばらくしてから再度お試しください。"},
                    status=500
                )
                
        if flagged:
            return Response(
                {"error": "AIチェックの結果：不適切な内容が含まれているため投稿できません。"},
                status=400
            )

        
        # 親コメントある場合取得
        parent_comment = None
        if parent_comment_id:
            parent_comment = Comment.objects.filter(comment_id=parent_comment_id, is_deleted=False).first()
            
        # コメント作成
        comment = Comment.objects.create(
            post=post, user=request.user, content=content, parent_comment=parent_comment
        )
        
        serializer = CommentSerializer(comment, context={"request": request})
        return Response(serializer.data, status=201)
    
    
    
    
    
# 削除
class CommentDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        comment = Comment.objects.filter(comment_id=comment_id).first()
        if not comment:
            return Response({"detail": "コメントが存在しません"}, status=status.HTTP_404_NOT_FOUND)

        # 自分のコメントのみ削除可能
        if comment.user != request.user:
            return Response({"detail": "削除権限がありません"}, status=status.HTTP_403_FORBIDDEN)

        comment.delete()
        return Response({"detail": "削除しました"}, status=status.HTTP_204_NO_CONTENT)
    
    
# コメント編集
class CommentEditAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, comment_id):
        comment = Comment.objects.filter(comment_id=comment_id).first()
        print(request)

        if not comment:
            return Response({"detail": "コメントが存在しません"}, status=status.HTTP_404_NOT_FOUND)
        
        # 編集権限チェック
        if comment.user_id != request.user.id:
            return Response({"detail": "編集権限がありません"}, status=status.HTTP_403_FORBIDDEN)

        comment.content = request.data.get("content", comment.content)
        comment.save()

        serializer = CommentSerializer(comment, context={"request": request})
        return Response(serializer.data, status=200)
    
    
# コメントした記事
class MyCommentedPostsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # user_idがあればその人の、なければ自分の情報を取得
        user_id = request.query_params.get("user_id")
        if user_id:
            user = User.objects.filter(id=user_id).first()
        else:
            user = request.user

        if not user or user.is_stopped:
            return Response({"error": "アクセスできません"}, status=404)

        # 対象ユーザー(user)がコメントした投稿を重複なしで取得
        posts = Post.objects.filter(
            comment__user=user, 
            is_deleted=False, 
            comment__user__is_stopped=False,
            post_user__is_stopped=False
        ).distinct().order_by("-created_at")

        # Serializerに「誰のコメントを表示するか(target_user)」を渡す
        serializer = MyCommentedPostSerializer(
            posts, 
            many=True, 
            context={"request": request, "target_user": user}
        )
        return Response(serializer.data)
