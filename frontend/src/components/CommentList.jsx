import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useCommentActions } from "@/hooks/useCommentActions"; 

const CommentList = ({ postId, currentUserId }) => {
    const [comments, setComments] = useState([]);
    const [replyTarget, setReplyTarget] = useState(null); // 返信先のコメントを保持
    const navigate = useNavigate();
    
    const { handleDelete, handleLike, handleFollow, setReportTarget } = useCommentActions(setComments, navigate);

    // 外側押したらフォーム閉じる
    useEffect(() => {   
        const handleOutsideClick = (e) => {
            if (replyTarget && !e.target.closest(".comment-form-container") && !e.target.closest(".reply-trigger-button")) {
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
            <div key={comment.comment_id} style={{ marginLeft: `${depth * 20}px` }}>
                {/* コメント本体 */}
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

                {/* 返信ボタン*/}
                {replyTarget && Number(replyTarget.comment_id) === Number(comment.comment_id) && (
                    <div key={`form-${comment.comment_id}`} style={{ margin: "10px 0", borderLeft: "2px solid #ccc", paddingLeft: "10px" }}>
                        <CommentForm 
                            postId={postId}
                            parentCommentId={comment.comment_id}
                            replyTargetName={comment.comment_author_name}
                            setComments={setComments}
                            onSuccess={() => setReplyTarget(null)} 
                        />
                        {/* ...キャンセルボタン */}
                    </div>
                )}


                {/* 子コメント（返信）の再帰表示 */}
                {comment.children && comment.children.length > 0 && (
                    <div className="comment-replies">
                        {renderComments(comment.children, depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="comment-list-section">
            {/* 新規コメント投稿（親用） */}
            <div style={{ marginBottom: "30px" }}>
                <CommentForm postId={postId} setComments={setComments} />
            </div>

            <h3>コメント {comments.length}件</h3>
            
            {comments.length > 0 ? (
                renderComments(comments)
            ) : (
                <p>コメントはまだありません。</p>
            )}
        </div>
    );
};

export default CommentList;
