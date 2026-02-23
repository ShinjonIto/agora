import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useCommentActions } from "@/hooks/useCommentActions";
import "./CommentList.css";

const CommentList = ({ postId, currentUserId }) => {
    const [comments, setComments] = useState([]);
    const [replyTarget, setReplyTarget] = useState(null); // 返信先のコメントを保持
    const navigate = useNavigate();

    const { handleDelete, handleLike, handleFollow, setReportTarget } =
        useCommentActions(setComments, navigate);

    // 外側押したらフォーム閉じる
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                replyTarget &&
                !e.target.closest(".comment-form-container") &&
                !e.target.closest(".reply-trigger-button")
            ) {
                setReplyTarget(null);
            }
        };
        if (replyTarget) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [replyTarget]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axiosPrivate.get(`/api/comments/${postId}/`);
                setComments(res.data);
            } catch (err) {
                console.error("コメント取得失敗", err);
            }
        };
        fetchComments();
    }, [postId]);

    const renderComments = (commentList, depth = 0) => {
        return commentList.map((comment) => (
            <div
                key={comment.comment_id}
                className={`CommentNode ${depth > 0 ? "is-child" : "is-root"}`}
                style={{
                    // ✅ 子コメントは “少しだけ” インデント（深くしすぎない）
                    // 例: 0=0px, 1=12px, 2=20px, 3=26px ... みたいに頭打ち
                    "--indent": `${Math.min(depth * 10 + 12, 28)}px`,
                }}
            >
                {/* コメント本体 */}
                <div className="CommentNode__item">
                    <CommentItem
                        comment={comment}
                        currentUserId={currentUserId}
                        navigate={navigate}
                        handleDelete={handleDelete}
                        handleLike={handleLike}
                        handleFollow={handleFollow}
                        openReportModal={() => setReportTarget(comment)}
                        onReplyClick={(c) => setReplyTarget(c)}
                    />
                </div>

                {/* 返信フォーム */}
                {replyTarget &&
                    Number(replyTarget.comment_id) === Number(comment.comment_id) && (
                        <div className="CommentNode__replyForm" key={`form-${comment.comment_id}`}>
                            <CommentForm
                                postId={postId}
                                parentCommentId={comment.comment_id}
                                replyTargetName={comment.comment_author_name}
                                setComments={setComments}
                                onSuccess={() => setReplyTarget(null)}
                            />
                        </div>
                    )}

                {/* 子コメント（返信） */}
                {comment.children && comment.children.length > 0 && (
                    <div className="CommentNode__children">
                        {renderComments(comment.children, depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <section className="CommentListRoot">
            {/* 新規コメント投稿（親用） */}
            <div className="CommentList__form">
                <CommentForm postId={postId} setComments={setComments} />
            </div>

            <div className="CommentList__meta">
                <div className="CommentList__count">コメント {comments.length}件</div>
            </div>

            <div className="CommentList__body">
                {comments.length > 0 ? (
                    renderComments(comments)
                ) : (
                    <p className="CommentList__empty">コメントはまだありません。</p>
                )}
            </div>
        </section>
    );
};

export default CommentList;