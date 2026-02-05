# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import *



# コメント
class CommentSerializer(serializers.ModelSerializer):
    comment_author_name = serializers.CharField(
        source = "user.user_name",
        read_only = True
    )
    comment_author_icon = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ["comment_id", "comment_author_name", "comment_author_icon",
                    "parent_comment", "content", "like_count", "created_at"]
        
    def get_comment_author_icon(self, obj):
        request = self.context.get("request")
        if obj.user.icon_image:
            return request.build_absolute_uri(obj.user.icon_image.url)
        return None