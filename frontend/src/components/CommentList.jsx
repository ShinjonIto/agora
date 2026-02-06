import React, { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import CommentItem from "./CommentItem";

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
        const res = await axiosPrivate.get(`/api/comments/${postId}/`);
        setComments(res.data);
        };
        fetchComments();
    }, [postId]);

    return (
        <div>
        {comments.map((comment) => (
            <CommentItem
            key={comment.comment_id}
            comment={comment}
            setComments={setComments}
            />
        ))}
        </div>
    );
};

export default CommentList;
