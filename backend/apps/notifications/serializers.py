from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor_id = serializers.IntegerField(source="actor.id", read_only=True)
    actor_name = serializers.CharField(source="actor.user_name", read_only=True)
    actor_icon = serializers.ImageField(source="actor.icon_image", read_only=True)

    target_post_id = serializers.IntegerField(source="target_post.id", read_only=True, allow_null=True)
    target_comment_id = serializers.IntegerField(source="target_comment.id", read_only=True, allow_null=True)
    
    # 通知先ユーザー（自分）のID
    target_user_id = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model = Notification
        fields = [
            "notification_id",
            "notification_type",
            "actor_id",
            "actor_name",
            "actor_icon",
            "target_post_id",
            "target_comment_id",
            "target_user_id",
            "is_read",
            "created_at",
        ]
