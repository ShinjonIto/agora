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
    
    # フォロー・フォロワー一覧
    def get(self, request, post_user):
        try:
            # フォロー
            following_relations = Follow.objects.filter(follower_id=post_user)
            following_users = [rel.following for rel in following_relations]
            
            # フォロワー
            follower_relations = Follow.objects.filter(following_id=post_user)
            follower_users = [rel.follower for rel in follower_relations]

            # ユーザー情報をシリアライズ（簡易版）
            def serialize_user(user):
                return {
                    "id": user.id,
                    "user_name": user.user_name,
                    "icon_image": request.build_absolute_uri(user.icon_image.url) if user.icon_image else None
                }

            return Response({
                "following": [serialize_user(u) for u in following_users],
                "followers": [serialize_user(u) for u in follower_users]
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    
    
    # フォローボタン
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

