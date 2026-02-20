from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.follows.models import Follow
from apps.notifications.models import Notification



# フォロー通知
@receiver(post_save, sender=Follow)
def create_follow_notification(sender, instance, created, **kwargs):
    if not created:
        return

    if instance.to_user == instance.from_user:
        return

    Notification.objects.create(
        user=instance.to_user,
        actor=instance.from_user,
        notification_type=Notification.FOLLOW
    )