from django.urls import path
from .views import *

urlpatterns = [
    path('login/', LoginAPIView.as_view()),
    path("me/", my_profile),
]
