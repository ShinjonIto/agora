import React, { useState, useEffect, useRef } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import CommentForm from "./CommentForm";

const CommentItem = ({ comment, depth = 0, setComments, postId }) => {
    const [showReply, setShowReply] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [reporting, setReporting] = useState(false);
    const [reason, setReason] = useState("");
    const replyFormRef = useRef(null);

    // 外側クリックで返信フォームを閉じる
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showReply && replyFormRef.current && !replyFormRef.current.contains(event.target)) {
                setShowReply(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showReply]);

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
        } catch (err) {
            console.error(err);
        }
    };


    // 通報
    const submitReport = async () => {
        if (!reason.trim()) return alert("理由を入力してください");
        try {
            await axiosPrivate.post(`/api/reports/comments/${comment.comment_id}/`, { reason });
            alert("通報しました。");
            setReporting(false);
            setShowMenu(false);
        } catch (err) {
            alert("通報に失敗しました。")
        }
    };

    // 日付
    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = (today - postDay) / (1000 * 60 * 60 * 24);
        if (diffDays === 0) return "今日 " + postDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (diffDays === 1) return "昨日";
        if (diffDays === 2) return "一昨日";
        return postDate.toLocaleDateString();
    };

    
    return (
        <div style={{ marginLeft: depth * 20, marginTop: 12 }}>
            <p>{comment.comment_author_name}</p>
            {comment.comment_author_icon && (
                <img src={comment.comment_author_icon} alt="" style={{ width: 40, borderRadius: "50%" }} />
            )}

            <div className="comment-content-wrapper">
                内容：
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: comment.content }} style={{ padding: 0 }} />
            </div>

            <button onClick={() => handleCommentLike(comment.comment_id)}>💛 {comment.like_count}</button>

            {/* 親コメント（depth 0）の時だけ返信ボタンとフォームを表示 */}
            {depth === 0 && (
                <div ref={replyFormRef} style={{ display: "inline-block" }}>
                    <button onClick={() => setShowReply(!showReply)}>返信</button>
                    {showReply && (
                        <div style={{ 
                            marginTop: 10, padding: 10, border: "1px solid #ddd", borderRadius: 8, 
                            backgroundColor: "#fff", color: "#000", width: "500px"
                        }}>
                            <CommentForm
                                postId={postId}
                                parentCommentId={comment.comment_id}
                                setComments={setComments}
                                onSuccess={() => setShowReply(false)}
                            />
                        </div>
                    )}
                </div>
            )}

            <button onClick={() => setShowMenu(!showMenu)}>⋮</button>
            {showMenu && (
                <div><button onClick={() => setReporting(true)}>通報</button></div>
            )}

            {reporting && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
                    display: "flex", justifyContent: "center", alignItems: "center"
                }} onClick={() => setReporting(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>コメントを通報する</h3>
                        <textarea className="report-textarea" value={reason} onChange={(e) => setReason(e.target.value)} />
                        <div className="modal-buttons">
                            <button onClick={() => setReporting(false)}>キャンセル</button>
                            <button onClick={submitReport}>送信する</button>
                        </div>
                    </div>
                </div>
            )}

            <small style={{ display: "block", marginTop: 5 }}>{formatPostDate(comment.created_at)}</small>

            {comment.children?.map((child) => (
                <CommentItem key={child.comment_id} comment={child} depth={depth + 1} setComments={setComments} postId={postId} />
            ))}
        </div>
    );
};

export default CommentItem;
