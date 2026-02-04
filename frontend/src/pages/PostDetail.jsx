import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import OnePost from "../components/OnePost";

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
            <OnePost post={post} />
            
            <h3>コメント</h3>
            {comments.length === 0 ? (
                <p>コメントはまだありません</p>
            ) : (
                comments.map(comment => (
                    <div key={comment.comment_id}>
                        <p>{comment.comment_author_name}</p>
                        {comment.comment_author_icon && (
                            <img
                                src={comment.comment_author_icon}
                                alt={`${comment.comment_author_name}のアイコン`}
                                style={{ width: "30px", borderRadius: "50%" }}
                            />
                        )}
                        <p>{comment.content}</p>
                        <small>いいね: {comment.like_count}</small>
                        <br />
                        <small>{new Date(comment.created_at).toLocaleString()}</small>
                    </div>
                ))
            )}
        </MainLayout>
    );
};

export default PostDetail;
