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