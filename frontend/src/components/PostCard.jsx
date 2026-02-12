import ReactMarkdown from 'react-markdown';

// 画像
import Heart from "@/assets/images/icon/heart.svg?react";
import Comment from "@/assets/images/icon/comment.svg?react";
import Share from "@/assets/images/icon/share.svg?react";
import View from "@/assets/images/icon/view.svg?react";

// CSS
import "./PostCard.css";

const PostCard = ({
    post,
    currentUserId,
    openMenuId,
    toggleMenu,
    navigate,
    handleDelete,
    handleFollow,
    openReportModal,
    handleLike,
    formatPostDate,
    reportedPostIds
}) => {
    return (
        <div className="post" onClick={() => !openMenuId && navigate(`/posts/${post.post_id}`)}>
            <div className='dai_flex'>
                {/* 三点リーダー部分 */}
                <div style={{ position: "relative" }}>
                    <button onClick={(e) => toggleMenu(e, post.post_id)}>⋯</button>
                    {openMenuId === post.post_id && (
                        <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", background: "white", border: "1px solid #ccc", padding: "5px", zIndex: 10 }}>
                            {String(post.post_user) === String(currentUserId) ? (
                                <div>
                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/posts/edit/${post.post_id}`); }}>編集</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(post.post_id); }}>削除</button>
                                </div>
                            ) : (
                                <div>
                                    <button onClick={(e) => { e.stopPropagation(); handleFollow(post.post_user); }}>
                                        {post.is_followed ? "フォローを外す" : "フォロー"}
                                    </button>
                                    {reportedPostIds.includes(post.post_id) ? (
                                        <button disabled style={{ color: "gray" }}>通報済み</button>
                                    ) : (
                                        <button onClick={(e) => { e.stopPropagation(); openReportModal(post.post_id); }}>投稿を通報</button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className='syo_flex'>
                    <img src={post.author_icon} alt="icon" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                    <p>{post.author_name}</p>
                    <p style={{ fontSize: "0.8rem", color: "gray" }}>{formatPostDate(post.created_at)}</p>
                </div>
            </div>

            <div className='honbun'>
                <div className="titleBlock">
                    <h3>{post.title}</h3>
                    {post.department_name && <p className="dept">{post.department_name}</p>}
                </div>

                <div className="markdown-body">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </div>

            <div className="comment_flex">
                <button onClick={(e) => { e.stopPropagation(); handleLike(post.post_id); }} style={{ color: post.liked ? "red" : "gray" }}>
                    <Heart /> {post.like_count}
                </button>
                <button><Comment /> {post.comment_count}</button>
                <button><View /> {post.total_views}</button>
                <button onClick={(e) => e.stopPropagation()}><Share /></button>
            </div>
        </div>
    );
};

export default PostCard;
