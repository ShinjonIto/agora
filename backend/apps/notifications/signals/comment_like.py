from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.comments.models import CommentLike
from apps.notifications.models import Notification




# コメントいいね通知
@receiver(post_save, sender=CommentLike)
def create_comment_like_notification(sender, instance, created, **kwargs):
    if not created:
        return

    comment = instance.comment

    if comment.user == instance.user:
        return

    Notification.objects.create(
        user=comment.user,
        actor=instance.user,
        notification_type=Notification.COMMENT_LIKE,
        target_post=comment.post,
        target_comment=comment
    )