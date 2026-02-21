from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.follows.models import Follow
from apps.notifications.models import Notification

# フォロー通知
@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    if not created:
        return

    # 自分自身をフォローした場合（通常はViewで弾くが安全策として）
    if instance.following == instance.follower:
        return

    Notification.objects.create(
        user=instance.following,    # 通知先
        actor=instance.follower,    # 行動した人
        notification_type=Notification.FOLLOW
    )
