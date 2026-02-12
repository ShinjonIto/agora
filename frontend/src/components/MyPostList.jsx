import { useEffect, useState } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage"; 
import "./PostList.css";
import { useNavigate } from "react-router-dom";
import MyCommentItem from "./MyCommentItem"; 
import ReactMarkdown from 'react-markdown';

const MyPostList = ({ fetchType }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);

    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        return postDate.toLocaleDateString();
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = `/api/posts/${fetchType}/`; 
                const res = await axiosPrivate.get(url);
                console.log
                console.log(res.data)
                setPosts(res.data);
            } catch (err) {
                setError("データの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [fetchType]);


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
            <h2>{fetchType === "myposts" ? "自分の投稿" : fetchType === "mylikes" ? "いいねした投稿" : "コメントした投稿"}</h2>
            <div className="PostListScroll">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.post_id} className="PostItem" style={{ borderBottom: "1px white solid"}}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                                <img src={post.author_icon} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
                                <span>{post.author_name}</span>
                            </div>

                            <h3 onClick={() => navigate(`/posts/${post.post_id}`)}>
                                {post.title}
                            </h3>

                            {/* コメント表示エリア */}
                            {fetchType === "mycomments" && post.my_comments && post.my_comments.map((c) => (
                                <MyCommentItem 
                                    key={c.comment_id}
                                    comment={c}
                                    navigate={navigate}
                                    handleCommentDelete={handleCommentDelete}
                                    formatPostDate={formatPostDate}
                                />
                            ))}

                            {fetchType !== "mycomments" && (
                                <div className="markdown-body">
                                    <ReactMarkdown>
                                        {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                                    </ReactMarkdown>
                                </div>
                            )}
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
