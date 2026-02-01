from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import *



# home すべての記事
class PostList(APIView):
    def get(self, request):
        posts = Post.objects.filter(is_deleted = False).order_by("-created_at")
        
        # many = True   複数のデータであることを明示
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)