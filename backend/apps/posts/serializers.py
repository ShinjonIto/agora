# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import *
from apps.comments.models import Comment



# コミュニティ名
class DepartmentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()



# 記事の画像・順番
class PostImageSerializer(serializers.ModelSerializer):
    post_img = serializers.SerializerMethodField()
    
    class Meta:
        model = PostImage
        fields = ["post_img", "sort_order", "post_img_id"]
        
    def get_post_img(self, obj):
        request = self.context.get("request")
        if obj.post_img and request:
            return request.build_absolute_uri(obj.post_img.url)
        return request.build_absolute_uri(settings.MEDIA_URL + "users/icon_img/default.png")

        

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
    # 投稿者のアイコン
    author_icon = serializers.SerializerMethodField()
    
    # 投稿者名
    author_name = serializers.CharField(
        source="post_user.user_name",
        read_only=True
    )
    # 学科名
    department_name = serializers.CharField(source='get_department_display', read_only=True)
    
    # いいね済みか
    liked = serializers.SerializerMethodField()
    
    # コメント数
    comment_count = serializers.IntegerField(
        source="comment_set.count",
        read_only=True
    )
    
    class Meta:
        model = Post
        fields = ["post_id", "title", "content", "department_name", 
                    "author_icon", "author_name", "images", "like_count", 
                    "liked", "total_views", "comment_count", "created_at",
        ]
        
    # 投稿者アイコンの絶対URLを返す
    def get_author_icon(self, obj):
        request = self.context.get("request")
        if obj.post_user.icon_image:
            return request.build_absolute_uri(obj.post_user.icon_image.url)
        return None
    
    # 学科名 あれば「科」をつけ、なければ表示しない
    def get_department_name(self, obj):
        return f"{obj.get_department_display()}科" if obj.department is not None else None
    
    def get_liked(self, obj):
        request = self.context.get("request")  # Request オブジェクト
        user = request.user                     # ここで User オブジェクトを取得
        if user.is_authenticated:
            # PostLikeテーブルにこのユーザーと記事の組み合わせが存在するか
            return obj.postlike_set.filter(user=user).exists()
        return False



from apps.comments.serializers import CommentSerializer

# 記事詳細
class PostDetailSerializer(PostSerializer):
    comments = serializers.SerializerMethodField()

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + [
            "comments"
        ]

    def get_comments(self, obj):
        request = self.context.get("request")

        comments = Comment.objects.filter(post=obj, parent_comment__isnull=True, is_deleted=False
        ).order_by("created_at")

        return CommentSerializer(comments, many=True, context={"request": request}).data