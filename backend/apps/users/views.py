from rest_framework.views import APIView
from rest_framework.response import Response
from .models import User
from .serializers import UserIconSerializer

class UserIconAPIView(APIView):
    def get(self, request, user_id):
        user = User.objects.get(id=user_id)
        # オブジェクトをserializers.pyに渡す
        serializer = UserIconSerializer(user, context={"request": request})
        return Response(serializer.data)