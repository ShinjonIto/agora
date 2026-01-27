from django.contrib import admin
from .models import User, Student_management

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'email', 'permission', 'is_stopped', 'is_deleted', 'date_joined')
    search_fields = ('user_name', 'email')
    list_filter = ('permission', 'is_stopped', 'is_deleted')

@admin.register(Student_management)
class StudentManagementAdmin(admin.ModelAdmin):
    list_display = ('management_id', 'student_number', 'is_deleted')
