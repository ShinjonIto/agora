from django.urls import path
from .views import *

urlpatterns = [
    path("<int:post_id>/", CommentAPIView.as_view()),
]