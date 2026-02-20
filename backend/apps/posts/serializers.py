from django.conf import settings
from rest_framework import serializers
from .models import *
from apps.comments.models import Comment
from apps.follows.models import Follow
from apps.reports.models import Report




# コミュニティ名
class DepartmentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()




# 記事
class PostSerializer(serializers.ModelSerializer):
    is_followed = serializers.SerializerMethodField()
    is_reported = serializers.SerializerMethodField()
    post_user_id = serializers.IntegerField(source="post_user.id", read_only=True)
    like_count = serializers.IntegerField(source="postlike_set.count", read_only=True)
    author_icon = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField() # MethodFieldに変更
    department_name = serializers.CharField(source='get_department_display', read_only=True)
    liked = serializers.SerializerMethodField()
    comment_count = serializers.IntegerField(source="comment_set.count", read_only=True)

    class Meta:
        model = Post
        fields = ["post_id","post_user", "post_user_id", "title", "content", "department_name",
                    "author_icon", "author_name", "like_count",
                    "liked", "total_views", "is_followed", "is_reported",
                    "comment_count", "created_at",
        ]

    # 退会済みなら名前を伏せる
    def get_author_name(self, obj):
        if obj.post_user.is_deleted:
            return "退会済みユーザー"
        return obj.post_user.user_name

    # 退会済み、または未設定ならデフォルトアイコンを返す
    def get_author_icon(self, obj):
        request = self.context.get("request")
        # ユーザーが削除されているか、アイコンがない場合
        if obj.post_user.is_deleted or not obj.post_user.icon_image:
            default_path = f"{settings.MEDIA_URL}users/icon/default_img.png"
            return request.build_absolute_uri(default_path) if request else default_path

        return request.build_absolute_uri(obj.post_user.icon_image.url)

    def get_department_name(self, obj):
        return f"{obj.get_department_display()}科" if obj.department is not None else None

    def get_liked(self, obj):
        request = self.context.get("request")
        user = request.user if request else None
        if user and user.is_authenticated:
            return obj.postlike_set.filter(user=user).exists()
        return False

    def get_is_followed(self, obj):
        request = self.context.get("request")
        user = request.user if request else None
        if user and user.is_authenticated:
            return Follow.objects.filter(following=obj.post_user, follower=user).exists()
        return False

    def get_is_reported(self, obj):
        request = self.context.get("request")
        user = request.user if request else None
        if user and user.is_authenticated:
            return Report.objects.filter(reporter=user, report_type=Report.POST, target_post=obj).exists()
        return False





from apps.comments.serializers import CommentSerializer
# 記事詳細
class PostDetailSerializer(PostSerializer):
    comments = serializers.SerializerMethodField()

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ["comments"]

    def get_comments(self, obj):
        request = self.context.get("request")
        comments = Comment.objects.filter(post=obj, parent_comment__isnull=True, is_deleted=False).order_by("created_at")
        return CommentSerializer(comments, many=True, context={"request": request}).data




# 記事作成
class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["post_id", "title", "content", "department"]




# 自分がコメントした
class MyCommentedPostSerializer(PostSerializer):
    my_comments = serializers.SerializerMethodField()

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ["my_comments"]

    def get_my_comments(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return []

        user = request.user
        comments = Comment.objects.filter(post=obj, user=user, is_deleted=False).order_by("-created_at")

        return [
            {"comment_id": c.comment_id, "content": c.content, "post_user": c.user.id,
            "created_at": c.created_at}
            for c in comments
        ]
