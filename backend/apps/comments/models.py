from django.db import models
from django.conf import settings
from apps.posts.models import Post


# コメント
class Comment(models.Model):
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
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)
    


# コメントいいね
class CommentLike(models.Model):
    comment_like_id = models.AutoField(primary_key=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('comment', 'user')    # 同じコメントにいいねは一回しかできないように