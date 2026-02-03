from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated



# home すべての作成
class PostListAPIView(APIView):
    def get(self, request):
        posts = Post.objects.filter(is_deleted = False).order_by("-created_at")
        
        # many = True   複数のデータであることを明示
        serializer = PostSerializer(posts, many=True, context={"request": request})
        return Response(serializer.data)
    


# いいねボタン
class PostLikeToggleAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        user = request.user 
        try:
            # あれば取得、あれば作成 likeにはデータ、createdには作成した場合True、じゃなければFalse
            like, created = PostLike.objects.get_or_create(post_id=post_id, user=user)
            # 既にある場合、削除
            if not created:
                like.delete()
                liked = False
            else:
                liked = True

            like_count = PostLike.objects.filter(post_id=post_id).count()
            return Response({"liked" : liked, "like_count" : like_count}, status=status.HTTP_200_OK)
        except PostLike.DoesNotExist:
            return Response({"error": "投稿が存在しません"}, status=status.HTTP_404_NOT_FOUND)