from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer




# 通知一覧
class NotificationListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = (
            Notification.objects
            .filter(user=request.user)
            .select_related(
                "actor",
                "target_post",
                "target_comment"
            )
            .order_by("-created_at")
        )

        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)




# 通知既読状況
class NotificationReadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        notification_id = request.data.get("notification_id")
        qs = Notification.objects.filter(user=request.user, is_read=False)

        if notification_id:
            # 個別既読
            qs = qs.filter(notification_id=notification_id)
        
        # まとめて更新（notification_idがない場合は全ての未読が既読になる）
        qs.update(is_read=True)
        return Response({"status": "ok"})

    
    
    
# 未読件数
class NotificationUnreadCountAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"count": count})