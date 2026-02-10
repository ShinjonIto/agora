from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import ReportCreateSerializer
from apps.posts.models import Post
from apps.comments.models import Comment
from apps.reports.models import *

class ReportPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = Post.objects.filter(post_id=post_id).first()
        if not post:
            return Response({"error": "投稿が見つかりません"}, status=404)

        serializer = ReportCreateSerializer(
            data=request.data,
            context={
                "request": request,
                "report_type": Report.POST,
                "target_post": post,
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message": "通報しました"}, status=status.HTTP_201_CREATED)



class ReportCommentAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, comment_id):
        comment = Post.objects.filter(comment_id=comment_id).first()
        if not comment:
            return Response({"error": "コメントが見つかりません。"}, status=404)

        serializer = ReportCreateSerializer(
            data=request.data,
            context={
                "request": request,
                "report_type": Report.COMMENT,
                "target_post": comment,
            },
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"message": "通報しました"}, status=status.HTTP_201_CREATED)