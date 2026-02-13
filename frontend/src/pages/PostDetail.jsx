import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import MainLayout from "../layouts/MainLayout";         // メインレイアウト
import OnePost from "../components/OnePost";            // 記事
import CommentItem from "../components/CommentItem";    // コメント
import CommentForm from "../components/CommentForm";    // コメントフォーム


const PostDetail = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    // ユーザーID
    const currentUserId = Number(localStorage.getItem("user_id"));

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                // 記事取得
                const postRes = await axiosPrivate.get(`/api/posts/${postId}/`);
                setPost(postRes.data);

                // コメント取得
                const commentRes = await axiosPrivate.get(`/api/comments/${postId}/`);
                setComments(commentRes.data);

            } catch (err) {
                console.error(err);
                setError("記事またはコメントの取得に失敗しました");
            }
        };
        fetchPostAndComments();
    }, [postId]);


    // コメント件数を増やす関数
    const handleCommentSuccess = () => {
        setPost(prev => ({
            ...prev,
            comment_count: (prev.comment_count || 0) + 1
        }));
    };

    if (error) return <p>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div>
            {/* 記事 */}
            <OnePost post={post} />

            {/* コメント */}
            <h3>コメント</h3>
            {comments.length === 0 ? (
                <p>コメントはまだありません</p>
            ) : (
                comments.map(comment => (
                    <CommentItem
                        key={comment.comment_id}
                        comment={comment}
                        setComments={setComments}
                        postId={postId}
                        currentUserId={currentUserId}
                        navigate={navigate}
                    />
                ))
            )}

            {/* コメントフォーム */}
            <CommentForm postId={postId} setComments={setComments} onSuccess={handleCommentSuccess} />
        </div>
    );
};

export default PostDetail;
