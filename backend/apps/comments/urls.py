from django.urls import path
from .views import *

urlpatterns = [
    path("<int:post_id>/", CommentAPIView.as_view()),
    path("<int:comment_id>/like/", CommentLikeAPIView.as_view()),
    path("<int:post_id>/create/", CommentCreateAPIView.as_view()),
]