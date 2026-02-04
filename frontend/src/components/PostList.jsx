import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Loading from "./Loading";
import { useNavigate, useParams } from "react-router-dom";

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
            return postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <div>
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

            <div>
            <h2>記事一覧</h2>

            {/* 複数ある場合の表示方法 for文と同じ */}
            {sortedPosts.map((post) => (
                <div
                key={post.post_id}
                style={{ border: '1px solid black' }}
                onClick={() => navigate(`/posts/${post.post_id}`)}>
                    {/* アイコン */}
                    <img
                    src={post.author_icon}
                    alt={`${post.author_name}のアイコン`}
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                    {/* 名前 */}
                    <p>投稿者：{post.author_name}</p>
                    {/* タイトル */}
                    <h3>title : {post.title}</h3>
                    {/* 学科名 */}
                    <p>{post.department_name}</p>
                    {/* 内容 */}
                    <p>content : {post.content}</p>
                    {/* 記事画像 */}
                    <div>
                        {post.images
                            .sort((a, b) => a.sort_order - b.sort_order) // sort_order順に並び替え
                            .map((img) => (
                                <img
                                key={img.post_img_id}
                                src={img.post_img}        // DjangoのURL
                                alt={`記事${post.post_id}の画像`}
                                style={{ maxWidth: "200px", marginRight: "10px" }}
                                />
                        ))}
                    </div>
                    
                    {/* 投稿日時 */}
                    <small>
                        {formatPostDate(post.created_at)}
                    </small>
                    {/* いいねボタン・いいね数 */}
                    <button
                        onClick={() => handleLike(post.post_id)}  // クリックでtoggle
                        style={{ color: post.liked ? "red" : "gray" }}  // いいね済みは赤
                    >
                        💛 {post.like_count}
                    </button>
                    {/* 閲覧数 */}
                    <p>閲覧数：{post.total_views}</p>
                    {/* コメント数 */}
                    <p>{post.comment_count}件のコメント</p>
                </div>
            ))}
            </div>
        </div>
    );
};

export default PostList;