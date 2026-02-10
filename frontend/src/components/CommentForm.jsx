import React, { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const CommentForm = ({ postId, parentCommentId = null, setComments, onSuccess }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    // コメント投稿
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setLoading(true);
            setError(null);

            const res = await axiosPrivate.post(`/api/comments/${postId}/create/`, {
                content,
                parent_comment: parentCommentId,
            });

            const newComment = res.data;

            // 親コメント
            if (!parentCommentId) {
                setComments((prev) => [...prev, newComment]);
            } 
            // 子コメント（返信）
            else {
                const addReply = (list) =>
                    list.map((c) => {
                        if (c.comment_id === parentCommentId) {
                            return {
                                ...c,
                                children: [...(c.children || []), newComment],
                            };
                        }
                        if (c.children?.length) {
                            return {
                                ...c,
                                children: addReply(c.children),
                            };
                        }
                        return c;
                    });

                setComments((prev) => addReply(prev));
            }

            setContent("");
            if (onSuccess) onSuccess();


        } catch (err) {
            console.error(err);
            setError("コメントの投稿に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="コメントを入力"
                rows={3}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" disabled={loading || !content.trim()}>
                {loading ? "送信中..." : "コメントする"}
            </button>
        </form>
    );
};

export default CommentForm;
