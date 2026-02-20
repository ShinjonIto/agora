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
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # 停止中または削除済みのユーザーはログイン不可
        if getattr(user, "is_stopped", False) or getattr(user, "is_deleted", False):
            return Response(
                {"detail": "このアカウントは停止中または削除済みのためログインできません"},
                status=status.HTTP_403_FORBIDDEN
            )

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
    user = User.objects.filter(id=user_id, is_stopped=False).first()
    
    if not user:
        return Response({"detail": "ユーザー情報が存在しません"}, status=status.HTTP_404_NOT_FOUND)
        
    # フォロー数・フォロワー数を取得
    following_count = Follow.objects.filter(follower=user).count()  
    followers_count = Follow.objects.filter(following=user).count() 
    
    # 自分がこの人をフォローしているか
    is_followed = Follow.objects.filter(following=user, follower=request.user).exists()

    return Response({
        "id": user.id,
        "user_name": user.user_name,
        "icon_image": request.build_absolute_uri(user.icon_image.url) if user.icon_image else None,
        "is_followed": is_followed, 
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
        user = User.objects.filter(id=user_id, is_stopped=False).first()
        if not user:
            return Response({"detail": "ユーザーが見つかりません"}, status=status.HTTP_404_NOT_FOUND)

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
    
    
    
# 学生番号一覧取得
class StudentNumberListAPIView(APIView):
    permission_classes = [IsAdminPermission]
    
    def get(self, request):
        result = []
        management_numbers = Student_management.objects.filter(is_deleted=False)

        for m in management_numbers:
            try:
                user = User.objects.get(student_number=m.student_number, is_deleted=False)
                status = "停止中" if user.is_stopped else "利用中"
                user_id = user.id
            except User.DoesNotExist:
                status = "未登録"
                user_id = None

            result.append({
                "student_number": m.student_number,
                "status": status,
                "user_id": user_id,  # nullなら未登録
            })

        return Response(result)
    
    
    
# 学生の利用状況詳細
from rest_framework import status as drf_status
class StudentNumberDetailAPIView(APIView):
    permission_classes = [IsAdminPermission]

    # GET: 学生番号の利用状況を取得
    def get(self, request, student_number):
        user = User.objects.filter(student_number=student_number, is_deleted=False).first()
        if not user:
            return Response(
                {"detail": "未登録の学生番号は変更できません"},
                status=drf_status.HTTP_400_BAD_REQUEST
            )

        status_str = "停止中" if user.is_stopped else "利用中"
        return Response({
            "student_number": student_number,
            "status": status_str
        })

    # PATCH: 学生番号の利用状況を更新
    def patch(self, request, student_number):
        user = User.objects.filter(student_number=student_number, is_deleted=False).first()
        if not user:
            return Response(
                {"detail": "未登録の学生番号は変更できません"},
                status=drf_status.HTTP_400_BAD_REQUEST
            )

        status_value = request.data.get("status")
        if not status_value:
            return Response(
                {"detail": "ステータスが送信されていません"},
                status=drf_status.HTTP_400_BAD_REQUEST
            )

        if status_value not in ["停止中", "利用中"]:
            return Response(
                {"detail": "不正なステータス"},
                status=drf_status.HTTP_400_BAD_REQUEST
            )

        user.is_stopped = (status_value == "停止中")
        user.save()
        return Response({"detail": "更新しました"})
    
    
    

# 学生番号登録
class StudentNumberAddAPIView(APIView):
    permission_classes = [IsAdminPermission]  # adminのみ

    def post(self, request):
        serializer = StudentNumberAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result = serializer.save()

        return Response(result, status=status.HTTP_201_CREATED)
    



# 学生番号削除
class StudentNumberDeleteAPIView(APIView):
    permission_classes = [IsAdminPermission]

    def patch(self, request):
        serializer = StudentNumberDeleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        start = serializer.validated_data["start_number"]
        end = serializer.validated_data["end_number"]

        target_numbers = range(start, end + 1)
        students = Student_management.objects.filter(student_number__in=target_numbers)

        updated = []
        skipped = []

        for student in students:
            if student.is_deleted:
                skipped.append(student.student_number)
            else:
                student.is_deleted = True
                student.save()
                updated.append(student.student_number)

        return Response(
            {"deleted": updated, "skipped": skipped},
            status=drf_status.HTTP_200_OK
        )
        
        
        
# 管理者一覧
class AdminListAPIView(APIView):
    permission_classes = [IsAdminPermission]
    
    def get(self, request):
        admin_list = User.objects.filter(permission=0, is_deleted=False)
        serializer = AdminListSerializer(admin_list, many=True)
        return Response(serializer.data)
    
    
    
# 管理者追加
class AdminAddAPIView(APIView):
    permission_classes = [IsAdminPermission]

    def post(self, request):
        serializer = AdminAddSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "管理者を追加しました"})
    
    
    
    
    

# 管理者削除
# 管理者削除
class AdminDeleteAPIView(APIView):
    permission_classes = [IsAdminPermission]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id, permission=0, is_deleted=False)
        except User.DoesNotExist:
            return Response(
                {"detail": "管理者が見つかりません"},
                status=404
            )

        user.is_deleted = True
        user.save()

        return Response({"detail": "管理者を削除しました"})
    
    
    
    
# アカウント削除
class DeleteAccountAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        # 物理削除を実行（関連するデータも CASCADE 設定により削除されます）
        user.delete() 
        return Response({"message": "Account deleted"}, status=status.HTTP_204_NO_CONTENT)




# フォロー・フォロワー一覧
class UserFollowListAPIView(APIView):
    def get(self, request, user_id):
        # その人がフォローしている人を取得
        following = Follow.objects.filter(follower_id=user_id).select_related('following')
        following_data = UserSimpleSerializer([f.following for f in following], many=True, context={'request': request}).data
        
        # その人をフォローしている人を取得
        followers = Follow.objects.filter(following_id=user_id).select_related('follower')
        followers_data = UserSimpleSerializer([f.follower for f in followers], many=True, context={'request': request}).data

        return Response({
            "following": following_data,
            "followers": followers_data
        })
