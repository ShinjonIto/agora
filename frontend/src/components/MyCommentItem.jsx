import React, { useState, useRef } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import Heart from "@/assets/images/icon/heart.svg?react";
import ReportModal from "./ReportModal"; 
import MenuButton from "./MenuButton";

const MyCommentItem = ({ comment, currentUserId, navigate, handleCommentDelete, formatPostDate }) => {
    const [localLikeCount, setLocalLikeCount] = useState(comment.like_count || 0);
    const [reportTarget, setReportTarget] = useState(null); 

    // コメントいいね処理
    const handleCommentLike = async () => {
        try {
            const res = await axiosPrivate.post(`/api/comments/${comment.comment_id}/like/`);
            setLocalLikeCount(res.data.like_count);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ marginLeft: "10px", padding: "10px 0", borderBottom: "1px solid #444" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {/* 本文 */}
                <div 
                    className="ql-editor"
                    style={{ padding: 0, fontSize: "0.9rem", flex: 1, color: "white" }}
                    dangerouslySetInnerHTML={{ __html: comment.content }} 
                />
                
                {/* 三点リーダー */}
                <MenuButton 
                    type="comment"
                    targetId={comment.comment_id}
                    ownerId={comment.user}
                    currentUserId={currentUserId}
                    handlers={{
                        onEdit: (id) => navigate(`/comments/edit/${id}`),
                        onDelete: handleCommentDelete,
                        onReport: (id) => setReportTarget({ id, type: "comment" })
                    }}
                />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
                {/* いいねボタン */}
                <button onClick={handleCommentLike}>
                    <Heart style={{ width: "14px" }} /> {localLikeCount}
                </button>
                <small style={{ color: "gray" }}>{formatPostDate(comment.created_at)}</small>
            </div>

            {/* 共通通報モーダル */}
            {reportTarget && (
                <ReportModal 
                    type={reportTarget.type} 
                    targetId={reportTarget.id} 
                    onClose={() => setReportTarget(null)} 
                    onSuccess={() => console.log("通報完了")} 
                />
            )}
        </div>
    );
};

export default MyCommentItem;
