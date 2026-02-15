import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import UserProfile from "./UserProfile";
import MenuButton from "./MenuButton";
import { useCommentActions } from "@/hooks/useCommentActions";

const MyCommentList = ({ posts, currentUserId, navigate, handleDelete, handleFollow, openReportModal }) => {
    return (
        <>
            {posts.map(post => (
                <CommentPost
                    key={`${post.post_user}-${post.post_id}`}
                    post={post}
                    currentUserId={currentUserId}
                    navigate={navigate}
                    handleDelete={handleDelete}
                    handleFollow={handleFollow}
                    openReportModal={openReportModal}
                />
            ))}
        </>
    );
};

// 投稿ごとのコメントリスト
const CommentPost = ({ post, currentUserId, navigate, handleDelete, handleFollow, openReportModal }) => {
    const [comments, setComments] = useState(post.my_comments || []);
    const { handleEdit, handleDelete: handleCommentDelete, handleLike } = useCommentActions(setComments, navigate);

    useEffect(() => {
        setComments(post.my_comments || []);
    }, [post.my_comments]);

    if (!comments || comments.length === 0) return null;

    return (
        <div style={{ borderBottom: "1px solid white", padding: "10px 0" }}>
            {/* 投稿情報 */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <UserProfile
                        user={{ icon_image: post.author_icon }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mypage/${post.post_user}`);
                        }}
                    />
                    <div>
                        <div style={{ fontWeight: "bold", color: "white" }}>{post.author_name}</div>
                    </div>
                </div>
                <MenuButton
                    type="post"
                    targetId={post.post_id}
                    ownerId={post.post_user}
                    currentUserId={currentUserId}
                    handlers={{ 
                        onEdit: (id) => navigate(`/posts/edit/${id}`),
                        onDelete: handleDelete, 
                        onReport: (id) => openReportModal(id, "post"), 
                        onFollow: handleFollow,
                        isFollowed: post.is_followed,
                        isReported: post.is_reported
                    }}
                />
            </div>

            {/* 投稿タイトル */}
            <div style={{ color: "white", fontSize: "1rem", marginBottom: "5px" }}>{post.title}</div>

            {/* コメント部分 */}
            {comments.filter(c => c).map(c => (
                <CommentItem
                    key={c.comment_id ?? Math.random()}
                    comment={c}
                    currentUserId={currentUserId}
                    navigate={navigate}
                    handleDelete={() => handleCommentDelete(c.comment_id)}
                    handleLike={() => handleLike(c.comment_id)}
                    handleFollow={() => handleFollow(c.user)}
                    openReportModal={() => openReportModal(c.comment_id, "comment")}
                    updateComment={(updated) => {
                        setComments(prev =>
                            prev.map(com => (com.comment_id === updated.comment_id ? updated : com))
                        );
                    }}
                    onReplyClick={() => {}}
                />
            ))}
        </div>
    );
};

export default MyCommentList;