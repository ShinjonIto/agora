from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("posts/<int:post_id>/", ReportPostAPIView.as_view()),
    path("comments/<int:comment_id>/", ReportCommentAPIView.as_view()),
    path("users/<int:user_id>/", ReportAccountAPIView.as_view()),
]
