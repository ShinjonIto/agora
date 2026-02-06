import React, { useState } from "react";   // useState を追加
import axiosPrivate from "@/api/axiosPrivate";
import CommentForm from "./CommentForm";   // 返信フォーム

// depth : 0=親, 1=子
const CommentItem = ({ comment, depth = 0, setComments, postId }) => {
    const [showReply, setShowReply] = useState(false);

    // コメントいいね
    const handleCommentLike = async (commentId) => {
        try {
            const res = await axiosPrivate.post(
                `/api/comments/${commentId}/like/`
            );

            const { like_count } = res.data;

            const updateComments = (list) =>
                list.map((c) => {
                    if (c.comment_id === commentId) {
                        return { ...c, like_count };
                    }
                    if (c.children?.length) {
                        return {
                            ...c,
                            children: updateComments(c.children),
                        };
                    }
                    return c;
                });

            setComments((prev) => updateComments(prev));
        } catch (err) {
            console.error(err);
        }
    };

    // 日時表示
    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();

        const postDay = new Date(
            postDate.getFullYear(),
            postDate.getMonth(),
            postDate.getDate()
        );
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const diffDays = (today - postDay) / (1000 * 60 * 60 * 24);

        if (diffDays === 0) {
            return "今日 " + postDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
        } else if (diffDays === 1) {
            return "昨日";
        } else if (diffDays === 2) {
            return "一昨日";
        }
        return postDate.toLocaleDateString();
    };

    return (
        <div style={{ marginLeft: depth * 20, marginTop: 12 }}>
            {/* 投稿者 */}
            <p>{comment.comment_author_name}</p>

            {/* アイコン */}
            {comment.comment_author_icon && (
                <img
                    src={comment.comment_author_icon}
                    alt=""
                    style={{ width: 40, borderRadius: "50%" }}
                />
            )}

            {/* 内容 */}
            <p>{comment.content}</p>

            {/* アクション */}
            <button onClick={() => handleCommentLike(comment.comment_id)}>
                💛 {comment.like_count}
            </button>

            {/* 親コメントだけ　返信フォーム */}
            {depth === 0 && (
                <div>
                    <button onClick={() => setShowReply(!showReply)}>
                        返信
                    </button>
            
                    {showReply && (
                        <CommentForm
                            postId={postId}                      // 記事ID
                            parentCommentId={comment.comment_id} // 親コメント
                            setComments={setComments}
                            // 入力したら閉じる
                            onSuccess={() => setShowReply(false)}
                        />
                    )}
                </div>
            )}

            {/* 投稿日時 */}
            <small>{formatPostDate(comment.created_at)}</small>


            {/* 子コメント */}
            {comment.children?.map((child) => (
                <CommentItem
                    key={child.comment_id}
                    comment={child}
                    depth={depth + 1}
                    setComments={setComments}
                />
            ))}
        </div>
    );
};

export default CommentItem;
