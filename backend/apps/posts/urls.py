from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", PostListAPIView.as_view()),
    path("<int:post_id>/like/", PostLikeToggleAPIView.as_view()),
    path("<int:post_id>/", PostDetailAPIView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)