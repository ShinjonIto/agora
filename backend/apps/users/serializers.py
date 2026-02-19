# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import *
from django.contrib.auth import password_validation




# 会員登録
class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ["student_number", "user_name", "email", 
                    "password", "confirm_password"]

    def validate(self, data):
        # パスワード確認
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("パスワードが一致しません")
        
        student_number = data["student_number"]

        # 学生番号管理テーブルに存在しているか、削除されていないか
        student = Student_management.objects.filter(
            student_number=student_number, is_deleted=False
        ).first()
        if not student:
            raise serializers.ValidationError("この学生番号は登録できません")

        # すでに User に登録されていないか、停止中でないか
        existing_user = User.objects.filter(student_number=student_number, is_deleted=False).first()
        if existing_user:
            if existing_user.is_stopped:
                raise serializers.ValidationError("この学生番号は停止中のため登録できません")
            else:
                raise serializers.ValidationError("この学生番号はすでに登録済みです")
        
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        
        user = User.objects.create_user(
            username=str(validated_data["student_number"]),
            student_number=validated_data["student_number"],
            user_name=validated_data["user_name"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user
    
    


# ユーザー情報
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "user_name",
            "self_introduction",
            "icon_image",
            "email",
            "permission",
        ]
    
    def get_icon_image(self, obj):
        request = self.context.get("request")
        if obj.icon_image and request:
            return request.build_absolute_uri(obj.icon_image.url)
        return None
        
        
        
        
# フォロー・フォロワー一覧表示用
class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "user_name", "icon_image", "self_introduction"]





# アイコン画像だけ更新
class UserIconUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["icon_image"]

    
    
# アイコン画像もらうとき
class UserIconUpdateResponseSerializer(serializers.ModelSerializer):
    icon_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["icon_image"]

    def get_icon_image(self, obj):
        request = self.context.get("request")
        if obj.icon_image:
            return request.build_absolute_uri(obj.icon_image.url)
        return None
        

        
# ユーザー名・自己紹介文・メールアドレスだけ更新
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "user_name",
            "self_introduction",
            "email",
        ]
        
        

        


# パスワード変更
class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("現在のパスワードが正しくありません")
        return value

    def validate_new_password(self, value):
        user = self.context['request'].user
        try:
            password_validation.validate_password(value, user)
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value
    
    

# 学生番号一覧取得
class StudentNumberListSerializer(serializers.Serializer):
    student_number = serializers.IntegerField()
    status = serializers.CharField()
    user_id = serializers.IntegerField(source="id", allow_null=True)  # id を追加、未登録の場合は null
    
    
    

# 学生番号登録
class StudentNumberAddSerializer(serializers.Serializer):
    start_number = serializers.IntegerField(min_value=1)
    end_number = serializers.IntegerField(min_value=1)

    def validate(self, data):
        if data['start_number'] > data['end_number']:
            raise serializers.ValidationError("開始番号は終了番号以下である必要があります。")
        return data

    def save(self):
        start = self.validated_data['start_number']
        end = self.validated_data['end_number']
        
        # 範囲内の全番号をセット化
        target_numbers = set(range(start, end + 1))
        
        # データベースに既に存在する番号を取得
        existing_students = Student_management.objects.filter(
            student_number__in=target_numbers
        )
        
        # 状態ごとに分類
        existing_map = {s.student_number: s for s in existing_students}
        already_exists = []
        restored = []
        created = []

        # バルクインサート用のリスト
        new_objects = []

        for num in range(start, end + 1):
            if num in existing_map:
                student = existing_map[num]
                if student.is_deleted:
                    # 削除済みの場合は復元
                    student.is_deleted = False
                    student.save()
                    restored.append(num)
                else:
                    # 既に有効な状態で存在
                    already_exists.append(num)
            else:
                # 新規作成対象
                new_objects.append(Student_management(student_number=num))
                created.append(num)

        # 新規分を一括登録
        if new_objects:
            Student_management.objects.bulk_create(new_objects)

        return {
            "created": created,
            "restored": restored,
            "already_exists": already_exists
        }





    
# 学生番号削除
class StudentNumberDeleteSerializer(serializers.Serializer):
    start_number = serializers.IntegerField(min_value=1)
    end_number = serializers.IntegerField(min_value=1)

    def validate(self, data):
        start = data["start_number"]
        end = data["end_number"]
        if start > end:
            raise serializers.ValidationError("開始番号は終了番号以下である必要があります")
        return data
    
    
    

# 管理者一覧
class AdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "student_number"]
    
    
    
    
        
# 管理者追加
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User

class AdminAddSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["student_number", "user_name", "email",
            "password", "confirm_password"]

    def validate(self, data):
        # パスワード確認
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("パスワードが一致しません")
        return data  


    def validate_student_number(self, value):
        if User.objects.filter(
            student_number=value,
            is_deleted=False
        ).exists():
            raise serializers.ValidationError("この学生番号は既に登録されています")
        return value

    def create(self, validated_data):
        validated_data.pop("confirm_password")

        validated_data["password"] = make_password(validated_data["password"])
        validated_data["permission"] = 0  # 管理者固定
        validated_data["is_deleted"] = False

        return User.objects.create(**validated_data)