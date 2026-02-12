import { useState } from "react";
import Heart from "@/assets/images/icon/heart.svg?react";
import CommentIcon from "@/assets/images/icon/comment.svg?react";
import View from "@/assets/images/icon/view.svg?react";
import Share from "@/assets/images/icon/share.svg?react";
import "./PostCard.css";
import MenuButton from "./MenuButton";
import UserProfile from "./UserProfile";
import "quill/dist/quill.snow.css";

/**
 * 投稿一覧・詳細で使う投稿カード
 * カード全体クリック → 記事詳細へ遷移
 */
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
    // 自分の投稿かどうか
    const isMyPost =
        currentUserId &&
        post.post_user &&
        String(post.post_user) === String(currentUserId);

    // 三点メニューが開いているか（ページ遷移防止用）
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div
            className="post"
            onClick={() => {
                if (isMenuOpen) return;
                navigate(`/posts/${post.post_id}`);
            }}
        >
            <div>
                {/* 投稿者情報 */}
                <div>
                    <UserProfile user={{ icon_image: post.author_icon }} />
                    <p>{post.author_name}</p>
                    <p>{formatPostDate(post.created_at)}</p>
                </div>

                {/* 三点リーダー（ここからのクリックは親に伝えない） */}
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

            {/* 本文エリア */}
            <div className="honbun">
                <div className="titleBlock">
                    <h3>{post.title}</h3>
                    {post.department_name && (
                        <span className="dept">{post.department_name}</span>
                    )}
                </div>

                {/* Quillで作成したHTMLをそのまま表示 */}
                <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>

            {/* いいね・コメント数など */}
            <div
                className="comment_flex"
                style={{ display: "flex", gap: "15px", marginTop: "10px" }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.post_id);
                    }}
                    style={{
                        color: post.liked ? "red" : "gray",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                    }}
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

                <button
                    onClick={(e) => e.stopPropagation()}
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                    <Share style={{ width: "18px" }} />
                </button>
            </div>
        </div>
    );
};

export default PostCard;
