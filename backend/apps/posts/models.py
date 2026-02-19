from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator



# 記事
class Post(models.Model):
    MCH = 0
    CYC = 1
    SYS = 2

    DEPARTMENT_CHOICES = [
        (MCH, "自動車整備"),
        (CYC, "スポーツバイシクル"),
        (SYS, "情報システム"),
    ]
    
    post_id = models.AutoField(primary_key=True)
    post_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=300, blank=False)
    content = models.TextField(blank=False)
    department = models.IntegerField(
        choices=DEPARTMENT_CHOICES,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_views = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)



# 記事いいね
class PostLike(models.Model):
    post_like_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('post_id', 'user_id')    # 同じ記事にいいねは一回しかできないように
    
    