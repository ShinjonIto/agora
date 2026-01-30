# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import User

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
