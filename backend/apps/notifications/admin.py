from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('notification_id', 'user', 'notification_type', 'target_user', 'target_post', 'target_comment', 'is_read', 'created_at')
    search_fields = ('user__user_name',)
    list_filter = ('notification_type', 'is_read')
