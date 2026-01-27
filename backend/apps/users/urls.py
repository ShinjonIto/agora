from django.urls import path
from .views import UserIconAPIView

urlpatterns = [
    path('<int:user_id>/icon/', UserIconAPIView.as_view()),
]
