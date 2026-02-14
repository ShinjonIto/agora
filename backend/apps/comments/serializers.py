# Jsonに変換する Reactが読める形に変換
from rest_framework import serializers
from .models import *
from apps.posts.serializers import PostSerializer



# コメント
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")
    
    comment_author_id = serializers.IntegerField(source="user.id", read_only=True)
    
    # 子コメント
    children = serializers.SerializerMethodField()
    
    like_count = serializers.SerializerMethodField()
    
    liked = serializers.SerializerMethodField()
    
    is_followed = serializers.SerializerMethodField()
    is_reported = serializers.SerializerMethodField()

    comment_author_name = serializers.CharField(
        source = "user.user_name",
        read_only = True
    )
    
    comment_author_icon = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ["comment_id", "post_id", "comment_author_id", "user", 
                    "comment_author_name",  "comment_author_icon","parent_comment", "children", "content", "like_count", "liked", "is_followed", "is_reported", "created_at"]

    # いいね数
    def get_like_count(self, obj):
        return obj.likes.count()
        

    # このユーザーがいいねしてるか
    def get_liked(self, obj):
        request = self.context.get("request")
        if not request:
            return False
        else:
            return obj.likes.filter(user=request.user).exists()
        
    # アイコン
    def get_comment_author_icon(self, obj):
        request = self.context.get("request")
        if obj.user and obj.user.icon_image:
            return request.build_absolute_uri(obj.user.icon_image.url)
        return None
    
    # フォロー
    def get_is_followed(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated and obj.user:
            from apps.follows.models import Follow
            return Follow.objects.filter(following=obj.user, follower=request.user).exists()
        return False

    # 通報
    def get_is_reported(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            from apps.reports.models import Report
            # 通報タイプが COMMENT であることを確認
            return Report.objects.filter(reporter=request.user, report_type=Report.COMMENT, target_comment=obj).exists()
        return False
    
    # 子コメント
    def get_children(self, obj):
        request = self.context.get("request")
        children = Comment.objects.filter(parent_comment=obj, is_deleted=False).order_by("created_at")
        
        return CommentSerializer(children, many=True, context={"request": request}).data
    
    
    
# コメント作成
class CommentCreateSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")

    comment_author_name = serializers.CharField(
        source="user.user_name",
        read_only=True
    )

    class Meta:
        model = Comment
        fields = ["comment_id", "post", "user", "comment_author_name",
            "parent_comment", "content", "created_at"
        ]
        
        
        
# 自分のコメント
class MyCommentedPostSerializer(PostSerializer):
    my_comments = serializers.SerializerMethodField()
    author_name = serializers.CharField(source="post_user.user_name", read_only=True)
    author_icon = serializers.SerializerMethodField()

    class Meta(PostSerializer.Meta):
        fields = PostSerializer.Meta.fields + ["my_comments", "author_name", "author_icon"]

    # 投稿者のアイコン
    def get_author_icon(self, obj):
        request = self.context.get("request")
        if obj.post_user and obj.post_user.icon_image:
            return request.build_absolute_uri(obj.post_user.icon_image.url)
        return None

    # 自分のコメントを取得
    def get_my_comments(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return []

        user = request.user
        comments = Comment.objects.filter(post=obj, user=user, is_deleted=False).order_by("created_at")
        return CommentSerializer(comments, many=True, context={"request": request}).data