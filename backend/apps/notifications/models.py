from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Notification(models.Model):
    FOLLOW = 0
    POST_LIKE = 1
    COMMENT = 2
    COMMENT_LIKE = 3

    NOTIFICATION_TYPE_CHOICES = [
        (FOLLOW, "follow"),
        (POST_LIKE, "post_like"),
        (COMMENT, "comment"),
        (COMMENT_LIKE, "comment_like"),
    ]

    notification_id = models.AutoField(primary_key=True)

    # 通知を受け取る人
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    # 通知を起こした人
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="acted_notifications"
    )

    notification_type = models.IntegerField(choices=NOTIFICATION_TYPE_CHOICES)

    target_post = models.ForeignKey(
        "posts.Post",
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )

    target_comment = models.ForeignKey(
        "comments.Comment",
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if self.notification_type == self.FOLLOW:
            return

        if self.notification_type == self.POST_LIKE:
            if not self.target_post:
                raise ValidationError("POST_LIKEはtarget_post必須")

        if self.notification_type in [self.COMMENT, self.COMMENT_LIKE]:
            if not self.target_comment or not self.target_post:
                raise ValidationError("COMMENT系はpostとcomment必須")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)