import { useState } from "react";

import Heart from "@/assets/images/icon/heart.svg?react";
import CommentIcon from "@/assets/images/icon/comment.svg?react";
import View from "@/assets/images/icon/view.svg?react";
import Share from "@/assets/images/icon/share.svg?react";

// エフェクト
import { useFxKey } from "@/hooks/useFxKey";
import Ripple from "@/components/effects/Ripple";
import Burst from "@/components/effects/Burst";

import RichContent from "./RichContent";
import "./PostCard.css";
import MenuButton from "./MenuButton";
import UserProfile from "./UserProfile";
import Back_button from "./Back_button";
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
    variant = "list",
}) => {
    const isMyPost =
        currentUserId &&
        post.post_user &&
        Number(post.post_user) === Number(currentUserId);

    const { fxKey, showFx, triggerFx } = useFxKey();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isDetail = variant === "detail";
    // ポストリストのみ画像の一番最初のものを取り出す
    const getFirstImageSrc = (html) => {
        if (!html) return null;
        const doc = new DOMParser().parseFromString(html, "text/html");
        const img = doc.querySelector("img");
        return img?.getAttribute("src") || null;
    };

    const firstImg = getFirstImageSrc(post.content);

    return (
        <div
            className={`postCard click_area ${isDetail ? "isDetail" : ""}`}
            onClick={
                isDetail
                    ? undefined
                    : () => {
                        if (isMenuOpen) return;
                        navigate(`/posts/${post.post_id}`);
                    }
            }
        >
            <div className={`post ${isDetail ? "full" : "preview"}`}>
                <div className="dai_flex">
                    <div className="syo_flex">
                        {isDetail && (<div className="none">
                            <Back_button />
                        </div>
                        )}


                        {/* アイコン */}
                        <div className="icon-m">
                            <UserProfile
                                user={{
                                    icon_image: post.author_icon,
                                    id: post.post_user_id
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/mypage/${post.post_user_id}`);
                                }}
                            />
                        </div>
                        <p>{post.author_name}</p>
                        <p className="postDate">{formatPostDate(post.created_at)}</p>
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


                <div className="titleBlock">
                    <h3>{post.title}</h3>
                    {post.department_name && (
                        <span className="dept">{post.department_name}</span>
                    )}
                </div>
                <div className="honbun">
                    {/* 1枚目だけ表示（あれば） */}
                    {!isDetail && firstImg && (
                        <img className="postThumb" src={firstImg} alt="" loading="lazy" />
                    )}
                    <RichContent html={post.content} stopClickPropagation />
                </div>

                <div className="comment_flex">

                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            // 未いいね → いいね の時だけ発火
                            if (!post.liked) triggerFx(450);

                            handleLike(post.post_id);
                        }}
                        className={`icon_flex likeBtn ${post.liked ? "red" : "gray"}`}
                        style={{
                            "--ripple-inset": "-12px",
                            "--ripple-scale": 1.4,
                            "--ripple-opacity": 0.20,
                        }}
                    >
                        {showFx && (
                            <>
                                <Ripple fxKey={fxKey} />
                                <Burst
                                    fxKey={fxKey}
                                    spread={34}
                                    size={4}
                                    duration={520}
                                />
                            </>
                        )}

                        <Heart className="fx-foreground icon" />
                        {post.like_count}
                    </button>


                    <div
                        className="icon_flex"
                    >
                        <CommentIcon className="icon" />
                        {post.comment_count}
                    </div>
                    <div className="icon_flex">
                        <View className="icon" />
                        {post.total_views}
                    </div>
                    {/* <button onClick={(e) => e.stopPropagation()} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <Share style={{ width: "18px" }} />
                </button> */}
                </div>
            </div >
        </div >
    );
};

export default PostCard;