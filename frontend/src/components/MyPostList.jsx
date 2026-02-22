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

const MyPostList = ({ fetchType, pageUserId }) => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const currentUserId = Number(localStorage.getItem("userId"));
    const [sortType, setSortType] = useState("new");



    
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

                let url = "";
                if (fetchType === "myposts") {
                    url = `/api/posts/myposts/?user_id=${pageUserId}`;
                } else if (fetchType === "mylikes") {
                    url = `/api/posts/mylikes/?user_id=${pageUserId}`;
                } else if (fetchType === "mycomments") {
                    url = `/api/comments/mycomments/?user_id=${pageUserId}`;
                }

                const res = await axiosPrivate.get(url);
                setPosts(res.data);
            } catch (err) {
                console.error(err);
                setError("データの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [fetchType, pageUserId]);




    // 並び替え（コメントタブ以外）
    const sortedPosts =
        fetchType === "mycomments"
            ? posts
            : [...posts].sort((a, b) => {
                    if (sortType === "like") return b.like_count - a.like_count;
                    if (sortType === "view") return b.total_views - a.total_views;
                    if (sortType === "comment") return b.comment_count - a.comment_count;
                    return new Date(b.created_at) - new Date(a.created_at);
                });




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

            {/* 並び替えUI（コメントタブでは表示しない） */}
            {fetchType !== "mycomments" && (
                <div className="selectWrap">
                    <label htmlFor="sortType">並び替え：</label>
                    <select
                        id="sortType"
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                    >
                        <option value="new">新着順</option>
                        <option value="like">いいね順</option>
                        <option value="view">閲覧数順</option>
                        <option value="comment">コメント順</option>
                    </select>
                </div>
            )}

            {/* 一覧 */}
            <div className="PostListScroll">
                {sortedPosts.length > 0 ? (
                    fetchType === "mycomments" ? (
                        <MyCommentList
                            posts={sortedPosts}
                            sortType={sortType}
                            currentUserId={currentUserId}
                            navigate={navigate}
                            handleDelete={handlePostDelete}
                            handleFollow={handleFollow}
                            openReportModal={(id, type) =>
                                setReportTarget({ id, type })
                            }
                        />
                    ) : (
                        sortedPosts.map((post) => (
                            <PostCard
                                key={`${post.post_user}-${post.post_id}`}
                                post={post}
                                currentUserId={currentUserId}
                                navigate={navigate}
                                handleDelete={handlePostDelete}
                                handleLike={handlePostLike}
                                handleFollow={handleFollow}
                                formatPostDate={formatPostDate}
                                isReported={post.is_reported}
                                openReportModal={() =>
                                    setReportTarget({
                                        id: post.post_id,
                                        type: "post"
                                    })
                                }
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