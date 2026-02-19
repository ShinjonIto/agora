from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.posts.models import PostLike
from apps.notifications.models import Notification


@receiver(post_save, sender=PostLike)
def create_post_like_notification(sender, instance, created, **kwargs):
    if not created:
        return

    post = instance.post

    if post.post_user == instance.user:
        return

    Notification.objects.create(
        user=post.post_user,
        actor=instance.user,
        notification_type=Notification.POST_LIKE,
        target_post=post
    )
    
