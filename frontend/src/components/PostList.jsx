import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Loading from "./Loading";
import "./PostList.css";
import { useNavigate, useParams } from "react-router-dom";

// 画像
import Heart from "@/assets/images/icon/heart.svg?react";
import Comment from "@/assets/images/icon/comment.svg?react";
import Share from "@/assets/images/icon/share.svg?react";
import View from "@/assets/images/icon/view.svg?react";



const deptMap = {
    mch: 0, // 自動車学科
    cyc: 1, // バイシクル学科
    sys: 2, // 情報システム学科
};



const PostList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dept } = useParams();
    const [sortType, setSortType] = useState("new"); // 初期は新着順

    // useEffect … 画面表示時・状態変化時に処理を実行
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

    if (loading) return <Loading message="記事を読み込み中..." />;
    if (error) return <ErrorMessage message={error} />;

    // 並び替え処理
    const sortedPosts = [...posts].sort((a, b) => {
        if (sortType === "like") {
            return b.like_count - a.like_count;
        }
        if (sortType === "view") {
            return b.total_views - a.total_views;
        }
        if (sortType === "comment") {
            return b.comment_count - a.comment_count;
        }

        return new Date(b.created_at) - new Date(a.created_at);
    });


    // いいねボタン処理
    const handleLike = async (postId) => {
        try {
            // Djangoにpost_idを送り、liked・like_countを取得
            const res = await axiosPrivate.post(`/api/posts/${postId}/like/`);

            const newLiked = res.data.liked;
            const newLikeCount = res.data.like_count;

            // 新しい投稿一覧を作る
            const newPosts = posts.map(post => {
                // 押した投稿だけ更新　「…」はコピー
                if (post.post_id === postId) {
                    return {
                        ...post,
                        liked: newLiked,
                        like_count: newLikeCount,
                    };
                }
                // 関係ない投稿はそのまま
                return post;
            });

            // stateを更新
            setPosts(newPosts);

        } catch (err) {
            console.error(err);
        }
    };


    // 投稿日時　表示方法
    const formatPostDate = (dateString) => {
        // 日付をわかる形に変換
        const postDate = new Date(dateString);
        const now = new Date();

        const postDay = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const diffTime = today - postDay; // ミリ秒差
        const diffDays = diffTime / (1000 * 60 * 60 * 24); // 日数に変換

        if (diffDays === 0) {
            // 今日なら時間だけ表示
            return "今日 " + postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return "昨日";
        } else if (diffDays === 2) {
            return "一昨日";
        } else {
            // それ以前は日付表示
            return postDate.toLocaleDateString();
        }
    };




    return (
        <div className="postList">
            <h2>記事一覧</h2>

            {/* 並び替え */}
            <div>
                <label>並び替え：</label>
                <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                    <option value="new">新着順</option>
                    <option value="like">いいね順</option>
                    <option value="view">閲覧数順</option>
                    <option value="comment">注目順</option>
                </select>
            </div>

            {/* 投稿一覧 */}
            <div className="postListScroll">
                {sortedPosts.map((post) => (
                    <div
                        key={post.post_id}
                        className="post"
                        onClick={() => navigate(`/posts/${post.post_id}`)}
                    >
                        <img
                            src={post.author_icon}
                            alt={`${post.author_name}のアイコン`}
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                        />

                        <p>投稿者：{post.author_name}</p>
                        <h3>{post.title}</h3>
                        <p>{post.department_name}</p>
                        <p>{post.content}</p>

                        {/* 記事画像 */}
                        <div>
                            {post.images
                                .sort((a, b) => a.sort_order - b.sort_order)
                                .map((img) => (
                                    <img
                                        key={img.post_img_id}
                                        src={img.post_img}
                                        alt=""
                                        style={{ maxWidth: "200px", marginRight: "10px" }}
                                    />
                                ))}
                        </div>

                        <small>{formatPostDate(post.created_at)}</small>

                        {/* アクション */}
                        <div className="comment_flex">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLike(post.post_id);
                                }}
                                style={{ color: post.liked ? "red" : "gray" }}
                            >
                                <Heart /> {post.like_count}
                            </button>

                            <p><View /> {post.total_views}</p>
                            <p><Comment /> {post.comment_count}</p>
                            <p><Share /> 共有</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;