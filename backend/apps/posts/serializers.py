# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import *


# 記事の画像・順番
class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["post_img", "sort_order"]


# 記事
class PostSerializer(serializers.ModelSerializer):
    # 記事に紐づく画像
    images = PostImageSerializer(
        # source = どこから取るか
        source="postimage_set",
        many=True,
        read_only=True
    )
    # いいね数
    like_count = serializers.IntegerField(
        source="postlike_set.count",
        read_only=True
    )
    # 投稿者名
    author_name = serializers.CharField(
        source="post_user.user_name",
        read_only=True
    )
    
    class Meta:
        model = Post
        fields = ["post_id", "title", "content", "department", 
                    "author_name", "images", "like_count", "created_at",
        ]