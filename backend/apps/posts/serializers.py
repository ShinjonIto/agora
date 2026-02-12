from django.conf import settings
# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import *
from apps.comments.models import Comment
from apps.follows.models import Follow
from apps.reports.models import Report



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

        if obj.post_img:
            if request:
                return request.build_absolute_uri(obj.post_img.url)
            return obj.post_img.url
        
        default_path = f"{settings.MEDIA_URL}users/icon_img/default.png"
        if request:
            return request.build_absolute_uri(default_path)
        return default_path

        

# 記事
class PostSerializer(serializers.ModelSerializer):
    is_followed = serializers.SerializerMethodField() 
    is_reported = serializers.SerializerMethodField()
    
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
        fields = ["post_id","post_user", "title", "content", "department_name", 
                    "author_icon", "author_name", "images", "like_count", 
                    "liked", "total_views", "is_followed", "is_reported", 
                    "comment_count", "created_at",
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
    
    # いいね
    def get_liked(self, obj):
        request = self.context.get("request")  # Request オブジェクト
        user = request.user                     # ここで User オブジェクトを取得
        if user.is_authenticated:
            # PostLikeテーブルにこのユーザーと記事の組み合わせが存在するか
            return obj.postlike_set.filter(user=user).exists()
        return False
    
    # フォローしてるか
    def get_is_followed(self, obj):
        request = self.context.get("request")
        user = request.user
        if user.is_authenticated:
            # 自分がその記事の投稿者をフォローしているかチェック
            return Follow.objects.filter(following=obj.post_user, follower=user).exists()
        return False
    
    # 通報済みかどうか
    def get_is_reported(self, obj):
        request = self.context.get("request")
        user = request.user

        if not user.is_authenticated:
            return False

        return Report.objects.filter(reporter=user, report_type=Report.POST, target_post=obj).exists()




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
    
    

# 記事作成
class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        # 保存時に必要なデータだけ
        fields = ["post_id", "title", "content", "department"]
        
        
# 自分がコメントした
from apps.comments.models import Comment
class MyCommentedPostSerializer(PostSerializer):
    my_comments = serializers.SerializerMethodField()

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ["my_comments"]

    def get_my_comments(self, obj):
        request = self.context.get("request")
        if not request or not request.user:
            return []
        
        user = self.context.get("request").user
        # その記事に対する自分の最新コメントを取得
        comments = Comment.objects.filter(post=obj, user=user, is_deleted=False).order_by("-created_at")
        
        return [
            {"comment_id": c.comment_id, "content": c.content, "created_at": c.created_at} 
            for c in comments
        ]
