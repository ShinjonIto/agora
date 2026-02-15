from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.authtoken.views import ObtainAuthToken   # ユーザー名＋パスワードで認証する仕組み
from rest_framework.authtoken.models import Token            # Tokenテーブルを使う
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from apps.follows.models import Follow

# def get(self, request):     　                getの場合
# def post(self, request, *args, **kwargs):     postの場合


# ログイン
class LoginAPIView(ObtainAuthToken):
    permission_classes = [AllowAny]
    # postメソッド
    def post(self, request, *args, **kwargs):
        # Reactから送られてきたusername(学生番号格納), passwordをserializersに渡す
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        # バリデーション
        serializer.is_valid(raise_exception=True)
        # 認証成功したUserオブジェクトを取得
        user = serializer.validated_data['user']

        # 既にトークンがあれば再利用・なければトークン発行  
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
        })



# 会員登録
class SignupAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = SignupSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "登録成功"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(
            request.user,
            context={"request": request}
        )
        return Response(serializer.data)



# ユーザーのアイコン取得
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    user = User.objects.filter(id=user_id).first()
    
    if not user:
        return Response({"ユーザー情報が存在しません"}, status=status.HTTP_404_NOT_FOUND)
        
    # フォロー数・フォロワー数を取得
    following_count = Follow.objects.filter(follower=user).count()  
    followers_count = Follow.objects.filter(following=user).count() 

    return Response({
        "id": user.id,
        "user_name": user.user_name,
        "icon_image": request.build_absolute_uri(user.icon_image.url) if user.icon_image else None,
        "is_followed": False,  
        "following_count": following_count,
        "followers_count": followers_count,
    })
    
    
    
# アイコン画像変更
class UserIconUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        if request.user.id != user_id:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = UserIconUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            res_serializer = UserIconUpdateResponseSerializer(
                request.user,
                context={"request": request}
            )
            return Response(res_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# ユーザー情報
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, user_id):
        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request, user_id):
        # 自分以外は編集できないように
        if request.user.id != user_id:
            return Response({"detail": "権限がありません"},status=status.HTTP_403_FORBIDDEN)

        user = request.user
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)