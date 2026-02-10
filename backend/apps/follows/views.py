from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
import os


# フォロー
class FollowAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_user):
        user = request.user
        
        # もし自分のだったら
        if int(post_user) == user.id:
            return Response({"error": "自分自身をフォローすることはできません。"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # あれば取得、なければ作成
            follow, created = Follow.objects.get_or_create(following_id=post_user, follower=user)
            followed = True
            
            if not created:
                follow.delete()
                followed = False
            
            return Response({"followed" : followed}, status=status.HTTP_200_OK)
            
        except:
            return Response({"error": "フォローに失敗しました。"}, status=status.HTTP_404_NOT_FOUND)


