import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import PostCard from "./PostCard"; 
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage"; 
import "./PostList.css";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';


const MyPost = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);

    // ログインユーザーID
    const currentUserId = localStorage.getItem("userId");

    // 三点リーダーの開閉
    const toggleMenu = (e, postId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === postId ? null : postId);
    };



     // 自分の記事取得
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // バックエンドのURLに合わせて調整してください
                const res = await axiosPrivate.get("/api/posts/myposts/"); 
                setPosts(res.data);
            } catch (err) {
                setError("記事の取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);


    // 削除処理（PostCardに渡す用）
    const handleDelete = async (postId) => {
        if (!window.confirm("この記事を削除してもよろしいですか？")) return;
        try {
            await axiosPrivate.delete(`/api/posts/${postId}/delete/`);
            setPosts(posts.filter(post => post.post_id !== postId));
            alert("削除しました");
        } catch (err) { alert("削除に失敗しました"); }
    };


    // 日付フォーマット（PostCardに渡す用）
    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        return postDate.toLocaleDateString();
    };

    // いいね処理
    const handleLike = async (postId) => {
        try {
            const res = await axiosPrivate.post(`/api/posts/${postId}/like/`);
            setPosts(posts.map(p => 
                p.post_id === postId ? { ...p, liked: res.data.liked, like_count: res.data.like_count } : p
            ));
        } catch (err) { 
            console.error(err); 
        }
    };


    if (loading) return <Loading message="自分の投稿を読み込み中..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="MyPost">
            <h2>自分の投稿一覧</h2>

            <div className="PostListScroll">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard 
                            key={post.post_id}
                            post={post}
                            currentUserId={currentUserId}
                            openMenuId={openMenuId}
                            toggleMenu={toggleMenu}
                            navigate={navigate}
                            handleDelete={handleDelete}
                            formatPostDate={formatPostDate}
                            // 自分の記事一覧なのでフォローや通報ボタンのロジックは空でもOK
                            handleFollow={() => {}} 
                            openReportModal={() => {}}
                            handleLike={handleLike} 
                        />
                    ))
                ) : (
                    <p>まだ投稿がありません。</p>
                )}
            </div>
        </div>
    );
};

export default MyPost;