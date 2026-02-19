from django.urls import path
from .views import *

urlpatterns = [
    path("list/", NotificationListAPIView.as_view()),
    path("read/", NotificationReadAPIView.as_view()),
    path("unread/", NotificationUnreadCountAPIView.as_view()),
]