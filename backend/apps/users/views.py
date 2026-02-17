from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.authtoken.views import ObtainAuthToken   # ユーザー名＋パスワードで認証する仕組み
from rest_framework.authtoken.models import Token            # Tokenテーブルを使う
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from apps.follows.models import Follow
from .permissions import IsAdminPermission
from django.db import transaction

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
        "self_introduction": user.self_introduction,
        "following_count": following_count,
        "followers_count": followers_count,
    })
    
    
    
# アイコン画像変更
class UserIconUpdateAPIView(APIView):
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
class UserProfileAPIView(APIView):
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




# パスワード変更
from django.contrib.auth import update_session_auth_hash
class PasswordChangeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        user = request.user
        if user.id != user_id:
            return Response({"detail": "権限がありません"}, status=403)

        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)
        return Response({"detail": "パスワードを変更しました"})
    
    
    
# 学生番号一覧
class StudentNumberListAPIView(APIView):
    permission_classes = [IsAdminPermission]   # admin のみ

    def get(self, request):
        students = Student_management.objects.filter(is_deleted=False).order_by("student_number")
        data = [
            {"management_id": s.management_id, "student_number": s.student_number}
            for s in students
        ]
        return Response(data)    

    
    

# 学生番号登録
class StudentNumberAddAPIView(APIView):
    permission_classes = [IsAdminPermission]   # admin のみ

    def post(self, request):
        serializer = StudentNumberBulkSerializer(data=request.data)
        if serializer.is_valid():
            created = serializer.save()
            return Response({"created_count": len(created)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    

# 学生番号削除
class StudentNumberDeleteAPIView(APIView):
    permission_classes = [IsAdminPermission]

    @transaction.atomic
    def post(self, request):
        serializer = StudentNumberDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        start = serializer.validated_data["start_number"]
        end = serializer.validated_data["end_number"]

        targets = Student_management.objects.filter(
            student_number__gte=start,
            student_number__lte=end,
            is_deleted=False
        )

        numbers = list(targets.values_list("student_number", flat=True))
        deleted_count = targets.count()

        # 学生番号を削除
        targets.update(is_deleted=True)

        # その学生番号で作られた User も削除扱い
        User.objects.filter(
            student_number__in=numbers,
            is_deleted=False
        ).update(is_deleted=True)

        return Response(
            {
                "deleted_count": deleted_count,
                "deleted_numbers": numbers
            },
            status=status.HTTP_200_OK
        )