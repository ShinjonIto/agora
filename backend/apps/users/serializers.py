# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import *
from django.contrib.auth import password_validation


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ["student_number", "user_name", "email", 
                    "password", "confirm_password",
        ]
        
    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("パスワードが一致しません")
        
        student_number = data["student_number"]

        # 学生番号管理テーブルに存在するか
        student = Student_management.objects.filter(student_number=student_number, is_deleted=False).first()
        if not student:
            raise serializers.ValidationError("この学生番号は登録できません")
        
        return data

    def create(self, varidated_data):
        varidated_data.pop("confirm_password")
        
        user = User.objects.create_user(
            username = str(varidated_data["student_number"]),
            student_number = varidated_data["student_number"],
            user_name = varidated_data["user_name"],
            email = varidated_data["email"],
            password = varidated_data["password"],
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
    
    
    
# 学生番号一括登録
class StudentNumberBulkSerializer(serializers.Serializer):
    start_number = serializers.IntegerField()
    end_number = serializers.IntegerField()

    def validate(self, data):
        if data["start_number"] > data["end_number"]:
            raise serializers.ValidationError("開始番号が終了番号より大きいです")
        return data

    # 作成、既にあればスキップ
    def create(self, validated_data):
        created_list = []
        for num in range(validated_data["start_number"], validated_data["end_number"] + 1):
            obj, created = Student_management.objects.get_or_create(student_number=num)
            if created:
                created_list.append(obj)
        return created_list
    
    
    
    

# 学生番号削除
class StudentNumberDeleteSerializer(serializers.Serializer):
    start_number = serializers.IntegerField()
    end_number = serializers.IntegerField()

    def validate(self, data):
        if data["start_number"] > data["end_number"]:
            raise serializers.ValidationError("開始番号は終了番号以下にしてください")
        return data