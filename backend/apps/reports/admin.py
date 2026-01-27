from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('report_id', 'reporter', 'report_type', 'target_user', 'target_post', 'target_comment', 'is_resolved', 'created_at')
    search_fields = ('reporter__user_name', 'reason')
    list_filter = ('report_type', 'is_resolved')
