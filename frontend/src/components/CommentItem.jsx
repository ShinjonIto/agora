import React, { useState, useEffect, useRef } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import CommentForm from "./CommentForm";
import MenuButton from "./MenuButton"; // 共通ボタン
import ReportModal from "./ReportModal"; // 共通モーダル

const CommentItem = ({ comment, depth = 0, setComments, postId, currentUserId, navigate, handleCommentDelete }) => {
    const [showReply, setShowReply] = useState(false);
    // 通報とフォローの状態管理
    const [reportTarget, setReportTarget] = useState(null); 
    const [isReported, setIsReported] = useState(comment.is_reported || false);
    const [isFollowed, setIsFollowed] = useState(comment.is_followed || false);
    
    const replyFormRef = useRef(null);

    // フォロー処理
    const handleFollow = async (userId) => {
        try {
            const res = await axiosPrivate.post(`/api/users/${userId}/follow/`);
            setIsFollowed(res.data.is_followed);
        } catch (err) {
            console.error(err);
        }
    };

    // いいね
    const handleCommentLike = async (commentId) => {
        try {
            const res = await axiosPrivate.post(`/api/comments/${commentId}/like/`);
            const { like_count } = res.data;
            const updateComments = (list) =>
                list.map((c) => {
                    if (c.comment_id === commentId) return { ...c, like_count };
                    if (c.children?.length) return { ...c, children: updateComments(c.children) };
                    return c;
                });
            setComments((prev) => updateComments(prev));
        } catch (err) { console.error(err); }
    };

    // 日付フォーマット（既存）
    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "今日 " + postDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (diffDays === 1) return "昨日";
        return postDate.toLocaleDateString();
    };

    return (
        <div style={{ marginLeft: depth * 20, marginTop: 12, borderLeft: depth > 0 ? "1px solid #444" : "none", paddingLeft: depth > 0 ? 10 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {comment.comment_author_icon && (
                        <img src={comment.comment_author_icon} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                    )}
                    <span style={{ fontWeight: "bold" }}>{comment.comment_author_name}</span>
                </div>

                {/* 三点リーダー：自分なら編集・削除、他人ならフォロー・通報 */}
                <MenuButton 
                    type="comment"
                    targetId={comment.comment_id}
                    ownerId={comment.user}
                    currentUserId={currentUserId}
                    handlers={{
                        onEdit: (id) => navigate(`/comments/edit/${id}`),
                        onDelete: handleCommentDelete,
                        onReport: (id) => setReportTarget({ id, type: "comment" }),
                        onFollow: handleFollow,
                        isFollowed: isFollowed,
                        isReported: isReported,
                    }}
                />
            </div>

            <div className="comment-content-wrapper" style={{ marginTop: 5 }}>
                <div className="ql-snow">
                    <div className="ql-editor" dangerouslySetInnerHTML={{ __html: comment.content }} style={{ padding: 0 }} />
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: 8 }}>
                <button onClick={() => handleCommentLike(comment.comment_id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    💛 {comment.like_count}
                </button>
                {depth === 0 && <button onClick={() => setShowReply(!showReply)}>返信</button>}
                <small style={{ color: "gray" }}>{formatPostDate(comment.created_at)}</small>
            </div>

            {showReply && (
                <div ref={replyFormRef} style={{ marginTop: 10 }}>
                    <CommentForm
                        postId={postId}
                        parentCommentId={comment.comment_id}
                        setComments={setComments}
                        onSuccess={() => setShowReply(false)}
                    />
                </div>
            )}

            {/* 通報モーダル */}
            {reportTarget && (
                <ReportModal 
                    type="comment"
                    targetId={reportTarget.id}
                    onClose={() => setReportTarget(null)}
                    onSuccess={() => setIsReported(true)}
                />
            )}

            {/* 子コメントの再帰表示 */}
            {comment.children?.map((child) => (
                <CommentItem 
                    key={child.comment_id} 
                    comment={child} 
                    depth={depth + 1} 
                    setComments={setComments} 
                    postId={postId}
                    currentUserId={currentUserId}
                    navigate={navigate}
                    handleCommentDelete={handleCommentDelete}
                />
            ))}
        </div>
    );
};

export default CommentItem;
