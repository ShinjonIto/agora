import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage"; 
import "./PostList.css";
import { useNavigate } from "react-router-dom";
import MyCommentItem from "./MyCommentItem"; 
import PostCard from "./PostCard";
import ReportModal from "./ReportModal"; 

const MyPostList = ({ fetchType }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    
    // ユーザーID
    const currentUserId = localStorage.getItem("userId");

    // 通報
    const [reportTarget, setReportTarget] = useState(null); 

    // 日付
    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "今日 " + postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return "昨日";
        return postDate.toLocaleDateString();
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = `/api/posts/${fetchType}/`; 
                const res = await axiosPrivate.get(url);
                setPosts(res.data);
            } catch (err) {
                setError("データの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [fetchType]);


    // 通報モーダルを開く
    const openReportModal = (postId) => {
        setReportTarget({ id: postId, type: "post" });
    };

    // 通報成功時の処理
    const handleReportSuccess = (id) => {
        setPosts(posts.map(post => post.post_id === id ? { ...post, is_reported: true } : post));
    };


    // 削除処理（PostCardから呼ばれる）
    const handleDelete = async (postId) => {
        if (!window.confirm("この記事を削除してもよろしいですか？")) return;
        try {
            await axiosPrivate.delete(`/api/posts/${postId}/delete/`);
            setPosts(posts.filter(p => p.post_id !== postId));
            alert("削除しました");
        } catch (err) {
            alert("削除に失敗しました");
        }
    };

    // いいね処理（PostCardから呼ばれる）
    const handleLike = async (postId) => {
        try {
            const res = await axiosPrivate.post(`/api/posts/${postId}/like/`);
            setPosts(posts.map(post =>
                post.post_id === postId ? { ...post, liked: res.data.liked, like_count: res.data.like_count } : post
            ));
        } catch (err) { console.error(err); }
    };

    // コメント削除
    const handleCommentDelete = async (commentId) => {
        if (!window.confirm("削除しますか？")) return;
        try {
            await axiosPrivate.delete(`/api/comments/${commentId}/delete/`);
            setPosts(posts.map(p => ({
                ...p,
                my_comments: p.my_comments?.filter(c => c.comment_id !== commentId)
            })));
        } catch (err) {
            alert("失敗しました");
        }
    };


    if (loading) return <Loading message="読み込み中..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="MyPost">

        {/* 通報 */}
        {reportTarget && (
                <ReportModal 
                    type={reportTarget.type} 
                    targetId={reportTarget.id} 
                    onClose={() => setReportTarget(null)} 
                    onSuccess={handleReportSuccess}
                />
        )}

            <h2>{fetchType === "myposts" ? "自分の投稿" : fetchType === "mylikes" ? "いいねした投稿" : "コメントした投稿"}</h2>
            <div className="PostListScroll">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.post_id} style={{ borderBottom: "1px white solid"}}>
                            {/* PostCardを再利用（全ての情報を渡す） */}
                            <PostCard 
                                post={post}
                                currentUserId={currentUserId}
                                navigate={navigate}
                                handleDelete={handleDelete}
                                handleLike={handleLike}
                                formatPostDate={formatPostDate}
                                isReported={post.is_reported}
                                openReportModal={openReportModal}
                            />

                            {/* コメント表示エリア */}
                            {fetchType === "mycomments" && post.my_comments && post.my_comments.map((c) => (
                                <MyCommentItem 
                                    key={c.comment_id}
                                    comment={c}
                                    navigate={navigate}
                                    handleCommentDelete={handleCommentDelete}
                                    formatPostDate={formatPostDate}
                                    currentUserId={currentUserId} 
                                />
                            ))}
                        </div>
                    ))
                ) : (
                    <p>データがありません。</p>
                )}
            </div>
        </div>
    );
};

export default MyPostList;
