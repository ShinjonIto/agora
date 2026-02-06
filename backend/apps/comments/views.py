from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated



class CommentAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, post_id):
        # 記事取得
        post = Post.objects.filter(post_id=post_id, is_deleted=False).first()
        if not post:
            return Response({"error": "記事が存在しません"}, status=404)

        # コメント取得（親コメントのみ）
        comments = Comment.objects.filter(post=post, parent_comment__isnull=True, is_deleted=False).order_by("created_at")

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
        
        # 親コメントある場合取得
        parent_comment = None
        if parent_comment_id:
            parent_comment = Comment.objects.filter(comment_id=parent_comment_id, is_deleted=False).first()
            
        # コメント作成
        comment = Comment.objects.create(
            post=post, user=request.user, content=content, parent_comment=parent_comment
        )
        
        serializer = CommentSerializer(comment, context={"request" : request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)