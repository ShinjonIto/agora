from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', LoginAPIView.as_view()),
    path('signup/', SignupAPIView.as_view()),
    path("<int:user_id>/", user_profile),
    path("me/", MeView.as_view()),
    path("settings/<int:user_id>/", UserProfileAPIView.as_view()),
    path("settings/<int:user_id>/icon/", UserIconUpdateAPIView.as_view()),
    path("settings/<int:user_id>/password/", PasswordChangeAPIView().as_view()),
    path("student_number/add/", StudentNumberAddAPIView().as_view()),
    path("student_number/list/", StudentNumberListAPIView().as_view()),
    path("student_number/delete/", StudentNumberDeleteAPIView().as_view()),
    path("student_number/detail/<int:student_number>/", StudentNumberDetailAPIView().as_view()),
    path("admin/list/", AdminListAPIView().as_view()),
    path("admin/add/", AdminAddAPIView().as_view()),
    path("admin/delete/<int:user_id>/", AdminDeleteAPIView().as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)