import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import "./PostList.css";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "./PostCard";
import ReportModal from "./ReportModal"; // インポート確認

const deptMap = { mch: 0, cyc: 1, sys: 2 };

const PostList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dept } = useParams();
    const [sortType, setSortType] = useState("new");
    const [reportTarget, setReportTarget] = useState(null);

    const currentUserId = localStorage.getItem("userId");

    // 通報モーダルを開く関数
    const openReportModal = (postId) => {
        setReportTarget({ id: postId, type: "post" });
    };

    // 通報
    const handleReportSuccess = (id) => {
        setPosts(posts.map(post => post.post_id === id ? { ...post, is_reported: true } : post));
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await axiosPrivate.get("/api/posts/", {
                    params: dept ? { department: deptMap[dept] } : {}
                });
                setPosts(res.data);
            } catch (err) {
                setError("記事の取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [dept]);


    // 並び替え
    const sortedPosts = [...posts].sort((a, b) => {
        if (sortType === "like") return b.like_count - a.like_count;
        if (sortType === "view") return b.total_views - a.total_views;
        if (sortType === "comment") return b.comment_count - a.comment_count;
        return new Date(b.created_at) - new Date(a.created_at);
    });


    // いいね
    const handleLike = async (postId) => {
        try {
            const res = await axiosPrivate.post(`/api/posts/${postId}/like/`);
            setPosts(posts.map(post =>
                post.post_id === postId ? { ...post, liked: res.data.liked, like_count: res.data.like_count } : post
            ));
        } catch (err) { console.error(err); }
    };


    // 日付
    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "今日 " + postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return "昨日";
        return postDate.toLocaleDateString();
    };


    // 削除
    const handleDelete = async (postId) => {
        if (!window.confirm("この記事を削除してもよろしいですか？")) return;
        try {
            await axiosPrivate.delete(`/api/posts/${postId}/delete/`);
            setPosts(posts.filter(post => post.post_id !== postId));
            alert("削除しました");
        } catch (err) {
            alert("削除に失敗しました");
        }
    };


    // フォロー
    const handleFollow = async (postUser) => {
        try {
            const res = await axiosPrivate.post(`/api/follows/${postUser}/`);
            const newIsFollowed = res.data.followed;
            setPosts(posts.map(post => post.post_user === postUser ? { ...post, is_followed: newIsFollowed } : post));
        } catch (err) { console.error(err); }
    };

    if (loading) return <Loading />;
    // if (error) return <ErrorMessage message={error} />;


    return (
        <div className="postList">
            {reportTarget && (
                <ReportModal
                    type={reportTarget.type}
                    targetId={reportTarget.id}
                    onClose={() => setReportTarget(null)}
                    onSuccess={handleReportSuccess}
                />
            )}

            <div className="label">
                <label>並び替え：</label>
                <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                    <option value="new">新着順</option>
                    <option value="like">いいね順</option>
                    <option value="view">閲覧数順</option>
                </select>
            </div>

            <div>
                {sortedPosts.map((post) => (
                    <PostCard
                        key={post.post_id}
                        post={post}
                        isReported={post.is_reported}
                        currentUserId={currentUserId}
                        navigate={navigate}
                        handleDelete={handleDelete}
                        handleFollow={handleFollow}
                        openReportModal={openReportModal}
                        handleLike={handleLike}
                        formatPostDate={formatPostDate}
                    />
                ))}
            </div>
        </div>
    );
};

export default PostList;
