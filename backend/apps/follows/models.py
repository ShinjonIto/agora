from django.db import models
from django.conf import settings


class Follow(models.Model):
    follow_id = models.AutoField(primary_key=True)
    following = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="followers")
    follower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="following")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("following", "follower")

