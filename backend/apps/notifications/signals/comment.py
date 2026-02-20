from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.comments.models import Comment
from apps.notifications.models import Notification



# コメント通知
@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):
    if not created:
        return

    post = instance.post

    if post.post_user == instance.user:
        return

    Notification.objects.create(
        user=post.post_user,
        actor=instance.user,
        notification_type=Notification.COMMENT,
        target_post=post,
        target_comment=instance
    )
    
    
    