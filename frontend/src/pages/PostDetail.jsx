import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import MainLayout from "../layouts/MainLayout";         // メインレイアウト
import OnePost from "../components/OnePost";            // 記事
import CommentItem from "../components/CommentItem";    // コメント


const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

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

    if (error) return <p>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <MainLayout>
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
                    />
                ))
            )}
        </MainLayout>
    );
};

export default PostDetail;
