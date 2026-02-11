import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage"; 
import "./PostList.css";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import PostCard from "./PostCard";


const deptMap = { mch: 0, cyc: 1, sys: 2 };

const PostList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { dept } = useParams();
    const [sortType, setSortType] = useState("new");
    const [openMenuId, setOpenMenuId] = useState(null); // メニュー管理用
    const [reportingPostId, setReportingPostId] = useState(null); // 通報対象のID あらたに表示
    const [reportReason, setReportReason] = useState("");         // 通報理由


    // ログインユーザーID
    const currentUserId = localStorage.getItem("userId");

    // 三点リーダー
    const toggleMenu = (e, postId) => {
        e.stopPropagation(); // 詳細へ飛ばないように
        setOpenMenuId(openMenuId === postId ? null : postId);
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


    // 三点リーダー
    useEffect(() => {
        const closeMenu = () => setOpenMenuId(null);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);


    if (loading) return <Loading message="記事を読み込み中..." />;
    if (error) return <ErrorMessage message={error} />;

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
        // アラート
        const ok = window.confirm("この記事を削除してもよろしいですか？");
        if (!ok) return;

        try {
            // APIたたく
            await axiosPrivate.delete(`/api/posts/${postId}/delete/`);

            // 成功したら、今の表示リストからその記事を除外して更新
            setPosts(posts.filter(post => post.post_id !== postId));

            alert("削除しました");
            } catch (err) {
                console.error(err);
                alert("削除に失敗しました");
        }
    };


    // フォロー
    const handleFollow = async (postUser) => {
        try {
            const res = await axiosPrivate.post(`/api/follows/${postUser}/`);
            
            // 新しいフォロー状態 (true/false) を受け取る
            const newIsFollowed = res.data.followed;

            // 全記事をチェックし、その投稿者の記事すべてのフォロー状態を更新する
            const newPosts = posts.map(post => {
                if (post.post_user === postUser) {
                    return { ...post, is_followed: newIsFollowed };
                }
                return post;
            });

            setPosts(newPosts);
        } catch (err) {
            console.error(err);
        }
    };


    // 通報ボタンを押した時の処理（モーダルを開く）
    const openReportModal = (postId) => {
        setReportingPostId(postId);
        setReportReason("");   // 理由をリセット
        setOpenMenuId(null);   // 三点リーダーメニューを閉じる
    }


    // 通報を実行する処理
    const handleReportSubmit = async () => {
        if (!reportReason) 
            return alert("理由を入力してください");

        try {
            // APIに理由を添えて送信
            await axiosPrivate.post(`/api/reports/posts/${reportingPostId}/`, {
            reason: reportReason
            });

            setPosts(posts.map(post =>
                post.post_id === reportingPostId
                    ? { ...post, is_reported: true }
                    : post
            ));

            alert("通報を送信しました。");
            setReportingPostId(null); // モーダルを閉じる
        } catch (err) {
            console.error(err);
            alert("通報に失敗しました。");
        }
    };

    return (
        <div className="postList">
            <div>
            {/* 通報モーダル */}
            {reportingPostId && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
                    display: "flex", justifyContent: "center", alignItems: "center"
                    }} className="ModalOverlay" onClick={() => setReportingPostId(null)}>
                    <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
                        <h3>投稿を通報する</h3>
                        <p className="ModalSubtitle">通報の理由を選択または入力してください</p>
                        
                        <textarea 
                            className="ReportTextArea"
                            placeholder="不適切なコンテンツ、スパムなど..."
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                        />

                        <div className="ModalButtons">
                            <button className="CancelBtn" onClick={() => setReportingPostId(null)}>
                                キャンセル
                            </button>
                            <button className="SubmitBtn" onClick={handleReportSubmit}>
                                送信する
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* 通報モーダルここまで */}
            </div>

            <h2>記事一覧</h2>
            <div>
                <label>並び替え：</label>
                <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                    <option value="new">新着順</option>
                    <option value="like">いいね順</option>
                    <option value="view">閲覧数順</option>
                </select>
            </div>

            {/* 投稿一覧 */}     
            <div className="PostListScroll">
                {sortedPosts.map((post) => (
                    <PostCard 
                        key={post.post_id}
                        post={post}
                        currentUserId={currentUserId}
                        openMenuId={openMenuId}
                        toggleMenu={toggleMenu}
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
