from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from .serializers import UserIconSerializer
from rest_framework.authtoken.views import ObtainAuthToken   # ユーザー名＋パスワードで認証する仕組み
from rest_framework.authtoken.models import Token            # Tokenテーブルを使う
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# def get(self, request):     　getの場合
# def post(self, request):     postの場合


# ログイン
class LoginAPIView(ObtainAuthToken):
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



# ユーザーのアイコン・名前
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_profile(request):
    user = request.user
    return Response({
        "user_name": user.user_name,
        "icon_image": request.build_absolute_uri(user.icon_image.url)
        if user.icon_image else None,
    })
    
