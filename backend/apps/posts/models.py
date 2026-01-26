from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


# 記事
class Post(models.Model):
    post_id = models.AutoField(primary_key=True)
    post_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=300, blank=False)
    content = models.TextField(blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_views = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)



# 記事画像
class PostImage(models.Model):
    post_img_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    post_img = models.ImageField(upload_to='posts/post_img/')
    sort_order = models.IntegerField(validators=[MinValueValidator(1)])



# 記事いいね
class PostLike(models.Model):
    post_like_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('post_id', 'user_id')    # 同じ記事にいいねは一回しかできないように
    