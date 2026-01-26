from django.db import models
from django.core.validators import ValidationError
from django.conf import settings


class Notification(models.Model):
    FOLLOW = 0
    POST = 1
    COMMENT = 2
    
    # DBには数字、表示では単語
    NOTIFICATION_TYPE_CHOICES = [
    (FOLLOW, "follow"),
    (POST, "post"),
    (COMMENT, "comment"),
    ]
    
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="notifications"
    )
    notification_type = models.IntegerField(
        choices=NOTIFICATION_TYPE_CHOICES
    )
    target_user = models.ForeignKey(         # アカウント
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="targeted_notifications"
    )
    target_post = models.ForeignKey(         # 投稿
        "posts.Post",
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )
    target_comment = models.ForeignKey(      # コメント
        "comments.Comment",
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)    
    
    # バリデーション
    def clean(self):
        # follow通知
        if self.notification_type == self.FOLLOW:
            if not self.target_user or self.target_post or self.target_comment:
                raise ValidationError("follow通知は target_user のみ指定してください")

        # post通知
        if self.notification_type == self.POST:
            if not self.target_post or self.target_user or self.target_comment:
                raise ValidationError("post通知は target_post のみ指定してください")

        # comment通知
        if self.notification_type == self.COMMENT:
            if not self.target_comment or self.target_user or self.target_post:
                raise ValidationError("comment通知は target_comment のみ指定してください")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

