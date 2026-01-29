from django.db import models
from django.conf import settings
from apps.posts.models import Post


# コメント
class Comment(models.Model):
    MCH = 0
    CYC = 1
    SYS = 2

    DEPARTMENT_CHOICES = [
        (MCH, "自動車整備"),
        (CYC, "スポーツバイシクル"),
        (SYS, "情報システム"),
    ]
    
    comment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies"
    )
    content = models.TextField()
    department = models.IntegerField(
        choices=DEPARTMENT_CHOICES,
        null=True,
        blank=True
    )
    like_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    
