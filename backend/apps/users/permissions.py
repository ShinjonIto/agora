from rest_framework.permissions import BasePermission

class IsAdminPermission(BasePermission):
    # User.permission が 0 の場合のみ許可
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, "permission", 1) == 0