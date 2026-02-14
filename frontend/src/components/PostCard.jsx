import { useState } from "react";
import Heart from "@/assets/images/icon/heart.svg?react";
import CommentIcon from "@/assets/images/icon/comment.svg?react";
import View from "@/assets/images/icon/view.svg?react";
import Share from "@/assets/images/icon/share.svg?react";
import "./PostCard.css";
import MenuButton from "./MenuButton";
import UserProfile from "./UserProfile";
import "quill/dist/quill.snow.css";

const PostCard = ({
    post,
    currentUserId,
    isReported,
    navigate,
    handleDelete,
    handleFollow,
    openReportModal,
    handleLike,
    formatPostDate,
}) => {
    const isMyPost =
        currentUserId &&
        post.post_user &&
        Number(post.post_user) === Number(currentUserId);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    console.log(post); // post_user が数値かオブジェクトか

    return (
        <div
            className="post"
            onClick={() => {
                if (isMenuOpen) return;
                navigate(`/posts/${post.post_id}`);
            }}
        >
            <div className="dai_flex">
                <div className="syo_flex">
                    {/* アイコン */}
                    <UserProfile
                        user={{ 
                            icon_image: post.author_icon, 
                            id: post.post_user_id 
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mypage/${post.post_user_id }`);
                        }}
                        />
                    <p>{post.author_name}</p>
                    <p>{formatPostDate(post.created_at)}</p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <MenuButton
                        type="post"
                        targetId={post.post_id}
                        ownerId={post.post_user} 
                        currentUserId={currentUserId}
                        setIsMenuOpen={setIsMenuOpen} 
                        handlers={{
                            onEdit: (id) => navigate(`/posts/edit/${id}`),
                            onDelete: handleDelete,
                            onReport: openReportModal,
                            onFollow: handleFollow,
                            isFollowed: post.is_followed,
                            isReported: isReported,
                        }}
                    />
                </div>
            </div>

            <div className="honbun">
                <div className="titleBlock">
                    <h3>{post.title}</h3>
                    {post.department_name && (
                        <span className="dept">{post.department_name}</span>
                    )}
                </div>
                <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
            <div className="comment_flex" style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                <button
                    onClick={(e) => { e.stopPropagation(); handleLike(post.post_id); }}
                    style={{ color: post.liked ? "red" : "gray", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
                >
                    <Heart style={{ width: "18px" }} />
                    {post.like_count}
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "gray" }}>
                    <CommentIcon style={{ width: "18px" }} />
                    {post.comment_count}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "gray" }}>
                    <View style={{ width: "18px" }} />
                    {post.total_views}
                </div>
                <button onClick={(e) => e.stopPropagation()} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <Share style={{ width: "18px" }} />
                </button>
            </div>
        </div>
    );
};

export default PostCard;