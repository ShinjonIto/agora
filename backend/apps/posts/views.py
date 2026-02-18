from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
import os
from apps.users.models import User


class DepartmentAPIView(APIView):
    def get(self, request):
        data = [
            {"id" : key, "name" : value}
            
            for key, value in Post.DEPARTMENT_CHOICES
        ]
        serializer = DepartmentSerializer(data, many=True)
        return Response(serializer.data)


# home すべての作成
class PostListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        dept = request.query_params.get("department")
        
        # 卒業した人の記事は取得・停止中の記事は取得しない
        posts = Post.objects.filter(is_deleted = False, post_user__is_stopped=False).order_by("-created_at")
        
        if dept is not None:
            posts = posts.filter(department=dept)
        
        # many = True   複数のデータであることを明示
        serializer = PostSerializer(posts, many=True, context={"request": request})
        return Response(serializer.data)
    
    

# 記事詳細
from django.db.models import F    # Django公式のF式
# 同時に2人がページを開いた時に、計算が合わなくなるためこれを使う
class PostDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, post_id):
        post = Post.objects.filter(post_id=post_id, is_deleted=False).first()
        
        if not post:
            return Response({"error": "記事が存在しません"}, status=404)
        
        # 閲覧数のところだけカウントアップしてそこだけ更新
        post.total_views = F('total_views') + 1
        post.save(update_fields=['total_views'])
        
        # 最新の状態を反映させるためにリロード
        post.refresh_from_db()

        if not post:
            return Response({"error": "記事が存在しません"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostDetailSerializer(post, context={"request": request})
        return Response(serializer.data)




# いいねボタン
class PostLikeToggleAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        user = request.user 
        try:
            # あれば取得、あれば作成 likeにはデータ、createdには作成した場合True、じゃなければFalse
            like, created = PostLike.objects.get_or_create(post_id=post_id, user=user)
            liked = True
            
            # 既にある場合、削除
            if not created:
                like.delete()
                liked = False

            like_count = PostLike.objects.filter(post_id=post_id).count()
            return Response({"liked" : liked, "like_count" : like_count}, status=status.HTTP_200_OK)
        except PostLike.DoesNotExist:
            return Response({"error": "投稿が存在しません"}, status=status.HTTP_404_NOT_FOUND)
        
        
        
class CreatePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # 記事作成
    def post(self, request):
        serializer = PostCreateSerializer(data=request.data)
        
        # バリデーション
        if serializer.is_valid():
            serializer.save(post_user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    


# 画像アップロード
class ImageUploadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return Response(status=400)

        # ただサーバーに画像を保存（記事とは紐づいていない）
        file_name = default_storage.save(f'posts/post_img/{file.name}', file)
        file_url = request.build_absolute_uri(default_storage.url(file_name))

        return Response({'url': file_url})
    
    
    
# 記事の更新（編集）
class PostUpdateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    # PUT 更新する際に使用
    def put(self, request, post_id):
        # 自分の記事、かつ削除されていないものを取得
        post = Post.objects.filter(post_id=post_id, post_user=request.user, is_deleted=False).first()
            
        if post:
            # 既存のデータ(post)に新しいデータ(request.data)を上書き
            # partial=True で一部の項目だけの更新も許容
            serializer = PostCreateSerializer(post, data=request.data, partial=True)
                
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response({"error": "記事が見つからないか、権限がありません"}, status=status.HTTP_404_NOT_FOUND)



# 記事の削除
class PostDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_id):
        # 自分の記事を取得
        post = Post.objects.filter(post_id=post_id, post_user=request.user, is_deleted=False).first()
            
        if post:
            post.is_deleted = True
            post.save()
            return Response({"message": "削除しました"}, status=status.HTTP_204_NO_CONTENT)
            
        else:
            return Response({"error": "記事が見つからないか、権限がありません"}, status=status.HTTP_404_NOT_FOUND)



# マイページの自分の記事一覧
class MyPostAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_id = request.query_params.get("user_id")
        
        # 他人のページ
        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "ユーザーが存在しません"}, status=404)
        # 自分のページ
        else: 
            user = request.user

        myposts = Post.objects.filter(post_user=user, is_deleted=False).order_by("-created_at")
        serializer = PostSerializer(myposts, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

            
            
# 自分がいいねした記事一覧
class MyLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_id = request.query_params.get("user_id")
        
        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "ユーザーが存在しません"}, status=404)
        else:
            user = request.user

        # いいねした順
        mylikepost = Post.objects.filter(postlike__user=user, is_deleted=False).order_by("-postlike__created_at")
        serializer = PostSerializer(mylikepost, many=True, context={'request' : request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
# 自分のコメント
class MyCommentPostAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_id = request.query_params.get("user_id")
        
        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "ユーザーが存在しません"}, status=404)
        else:
            user = request.user

        comment_posts = Post.objects.filter(comment__user=user, is_deleted=False).distinct().order_by("-created_at")
        serializer = MyCommentedPostSerializer(comment_posts, many=True, context={'request' : request})
        return Response(serializer.data, status=status.HTTP_200_OK)