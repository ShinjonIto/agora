import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import "./PostList.css";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "./PostCard";
import ReportModal from "./ReportModal"; 
import { usePostActions } from "@/hooks/usePostActions";

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

    // フックからロジック取得
    const { 
        handleDelete, 
        handleLike, 
        handleFollow, 
        formatPostDate, 
        reportTarget, 
        setReportTarget, 
        handleReportSuccess 
    } = usePostActions(setPosts); 

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
                        handleLike={handleLike}     
                        formatPostDate={formatPostDate} 
                        openReportModal={(id) => setReportTarget({ type: "post", id })}
                    />
                ))}
            </div>
        </div>
    );
};

export default PostList;
