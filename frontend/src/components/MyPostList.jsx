import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import PostCard from "./PostCard";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import ReportModal from "./ReportModal";
import { usePostActions } from "@/hooks/usePostActions";
import MyCommentList from "./MyCommentList";
import "./PostList.css";

const MyPostList = ({ fetchType }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserId = Number(localStorage.getItem("userId"));

    // 投稿用フック
    const {
        handleDelete: handlePostDelete,
        handleLike: handlePostLike,
        handleFollow,
        reportTarget,
        setReportTarget,
        handleReportSuccess,
        formatPostDate
    } = usePostActions(setPosts, navigate);

    // データ取得
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                // fetchType（タブ）によって叩くURLを切り替える
                let url = "";
                if (fetchType === "myposts") {
                    url = "/api/posts/myposts/";
                } else if (fetchType === "mylikes") {
                    url = "/api/posts/mylikes/";
                } else if (fetchType === "mycomments") {
                    url = "/api/comments/mycomments/"; 
                }

                const res = await axiosPrivate.get(url);
                console.log("Fetched posts:", res.data);
                setPosts(res.data); 

            } catch (err) {
                console.error(err);
                setError("データの取得に失敗しました");
            } finally {
                setLoading(false);
            }
            };
            fetchPosts();
        }, [fetchType]);

    if (loading) return <Loading message="読み込み中..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="MyPost">
        {reportTarget && (
            <ReportModal
            type={reportTarget.type}
            targetId={reportTarget.id}
            onClose={() => setReportTarget(null)}
            onSuccess={handleReportSuccess}
            />
        )}

        <h2>
            {fetchType === "myposts"
            ? "自分の投稿"
            : fetchType === "mylikes"
            ? "いいねした投稿"
            : "コメントした投稿"}
        </h2>

        <div className="PostListScroll">
            {posts.length > 0 ? (
            fetchType === "mycomments" ? (
                <MyCommentList
                posts={posts}
                currentUserId={currentUserId}
                navigate={navigate}
                formatPostDate={formatPostDate}
                handleDelete={handlePostDelete}
                handleFollow={handleFollow}
                openReportModal={(id, type = "comment") => setReportTarget({ id: id, type: type })}
                />
            ) : (
                posts.map(post => (
                <PostCard
                    key={post.post_id}
                    post={post}
                    currentUserId={currentUserId}
                    navigate={navigate}
                    handleDelete={handlePostDelete}
                    handleLike={handlePostLike}
                    formatPostDate={formatPostDate}
                    isReported={post.is_reported}
                    openReportModal={() => setReportTarget({ id: post.post_id, type: "post" })}
                />
                ))
            )
            ) : (
            <p>データがありません。</p>
            )}
        </div>
        </div>
    );
};

export default MyPostList;