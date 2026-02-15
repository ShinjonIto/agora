from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', LoginAPIView.as_view()),
    path('signup/', SignupAPIView.as_view()),
    path("<int:user_id>/", user_profile),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)