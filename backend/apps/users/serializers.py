# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import User

class UserIconSerializer(serializers.ModelSerializer):
    icon_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'user_name', 'icon_image']

    def get_icon_image(self, obj):
        request = self.context.get("request")
        if obj.icon_image and request:
            return request.build_absolute_uri(obj.icon_image.url)
        return None
