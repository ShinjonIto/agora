from django.db import models
from django.contrib.auth.models import AbstractUser


# ユーザー
class User(AbstractUser):
    # id, username, password, date_joined, email 　AbstractUserで既にフィールドある
    student_number = models.PositiveIntegerField(unique=True)
    user_name = models.CharField(max_length=30, unique=True)
    permission = models. IntegerField(default=1)    # admin = 0, user = 1
    icon_image = models.ImageField(upload_to='users/icon/', default='users/icon/default_img.png')
    self_introduction = models.CharField(max_length=150, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_stopped = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    
    # student_number を、Django内部用の username に自動コピーしてから保存
    def save(self, *args, **kwargs):
        if not self.username:
            self.username = str(self.student_number)
        super().save(*args, **kwargs)  



# 学生管理
class Student_management(models.Model):
    management_id = models.AutoField(primary_key=True)
    student_number = models.PositiveIntegerField(unique=True)
    is_deleted = models.BooleanField(default=False)
    