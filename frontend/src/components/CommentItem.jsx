import React from "react";
import axiosPrivate from "@/api/axiosPrivate";

// depth : 0=親, 1=子
const CommentItem = ({ comment, depth = 0, setComments }) => {

    const handleCommentLike = async (commentId) => {
        try {
        const res = await axiosPrivate.post(
            `/api/comments/${commentId}/like/`
        );

        const { like_count } = res.data;

        // 再帰的にコメント更新
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

    return (
        <div style={{ marginLeft: depth * 20}}>
        <p>{comment.comment_author_name}</p>

        <img
            src={comment.comment_author_icon}
            alt=""
            style={{ width: 40, borderRadius: "50%" }}
        />

        <p>{comment.content}</p>

        <button onClick={() => handleCommentLike(comment.comment_id)}>
            💛 {comment.like_count}
        </button>

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
