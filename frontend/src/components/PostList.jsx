import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Loading from "./Loading";



const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect … 画面表示時・状態変化時に処理を実行
    useEffect(() => {
    const fetchPosts = async () => {
        try {
            const res = await axiosPrivate.get("/api/posts/");
            setPosts(res.data);
        } catch (err) {
            console.error(err);
            setError("記事の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    fetchPosts();
    }, []);

    if (loading) return <Loading message="記事を読み込み中..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div>
        <h2>記事一覧</h2>

        {posts.map((post) => (
            <div
            key={post.post_id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            <small>
                投稿者：{post.author_name} /
                {new Date(post.created_at).toLocaleString()}
            </small>

            <p>❤️ {post.like_count}</p>
            </div>
        ))}
        </div>
    );
};

export default PostList;