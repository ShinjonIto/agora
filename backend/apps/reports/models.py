from django.db import models
from django.core.validators import ValidationError
from django.conf import settings


class Report(models.Model):
    ACCOUNT = 0
    COMMENT = 1
    POST = 2

    REPORT_TYPE_CHOICES = [
        (ACCOUNT, "account"),
        (COMMENT, "comment"),
        (POST, "post"),
    ]

    report_id = models.AutoField(primary_key=True)

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports_made"       # アカウントが通報した一覧参照するとき
    )
    report_type = models.IntegerField(
        choices=REPORT_TYPE_CHOICES
    )
    target_user = models.ForeignKey(      # アカウント
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="account_reports"    # アカウントが通報された履歴
    )
    target_post = models.ForeignKey(      # 投稿
        "posts.Post",
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )
    target_comment = models.ForeignKey(   # コメント
        "comments.Comment",
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )
    reason = models.CharField(max_length=1000)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def clean(self):
        targets = [
            self.target_user,
            self.target_post,
            self.target_comment,
        ]

        # 通報対象は必ず1つだけ
        if sum(t is not None for t in targets) != 1:
            raise ValidationError("通報対象は1つだけ指定してください")
        # 通報タイプと対象の整合性チェック
        if self.report_type == self.ACCOUNT and not self.target_user:
            raise ValidationError("account通報には target_user が必要です")
        if self.report_type == self.POST and not self.target_post:
            raise ValidationError("post通報には target_post が必要です")
        if self.report_type == self.COMMENT and not self.target_comment:
            raise ValidationError("comment通報には target_comment が必要です")

