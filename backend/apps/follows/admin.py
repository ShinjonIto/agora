from django.contrib import admin
from .models import Follow

@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('follow_id', 'following', 'follower', 'created_at')
    search_fields = ('following__user_name', 'follower__user_name')
