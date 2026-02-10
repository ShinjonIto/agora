# apps/reports/serializers.py
from rest_framework import serializers
from .models import Report

class ReportCreateSerializer(serializers.ModelSerializer):
    reporter = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Report
        fields = (
            "reporter",
            "report_type",
            "target_user",
            "target_post",
            "target_comment",
            "reason",
        )
        read_only_fields = (
            "report_type",
            "target_user",
            "target_post",
            "target_comment",
        )

    def validate(self, data):
        user = self.context["request"].user
        report_type = self.context.get("report_type")

        # 投稿の二重通報防止
        if report_type == Report.POST:
            post = self.context.get("target_post")
            if Report.objects.filter(
                reporter=user,
                report_type=Report.POST,
                target_post=post
            ).exists():
                raise serializers.ValidationError("すでに通報しています")
            
        # コメントの二重通報防止
        if report_type == Report.COMMENT:
            comment = self.context["target_comment"]
            if Report.objects.filter(
                reporter=user,
                report_type=Report.COMMENT,
                target_comment=comment
            ).exists():
                raise serializers.ValidationError("すでに通報しています")
        return data


    def create(self, validated_data):
        validated_data["report_type"] = self.context["report_type"]

        if self.context["report_type"] == Report.POST:
            validated_data["target_post"] = self.context["target_post"]

        if self.context["report_type"] == Report.COMMENT:
            validated_data["target_comment"] = self.context["target_comment"]

        return super().create(validated_data)
