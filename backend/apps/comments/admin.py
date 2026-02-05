from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('comment_id', 'user', 'post', 'parent_comment',  'created_at', 'is_deleted')
    search_fields = ('content', 'user__user_name', 'post__title')
    list_filter = ('is_deleted',)
    
    
