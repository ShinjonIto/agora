from django.contrib import admin
from .models import Post, PostLike

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'title', 'post_user', 'created_at', 'updated_at', 'is_deleted')
    search_fields = ('title', 'content', 'post_user__user_name')
    list_filter = ('is_deleted',)


@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    list_display = ('post_like_id', 'post_id', 'user_id', 'created_at')
