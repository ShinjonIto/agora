import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import UserProfile from "./UserProfile";
import MenuButton from "./MenuButton";
import { useCommentActions } from "@/hooks/useCommentActions";
import "./MyCommentList.css"


const MyCommentList = ({
    posts,
    sortType,
    currentUserId,
    navigate,
    handleDelete,
    handleFollow,
    openReportModal
}) => {
    return (
        <div>
            {posts.map(post => (
                <CommentPost
                    key={`${post.post_user}-${post.post_id}`}
                    post={post}
                    sortType={sortType}
                    currentUserId={currentUserId}
                    navigate={navigate}
                    handleDelete={handleDelete}
                    handleFollow={handleFollow}
                    openReportModal={openReportModal}
                />
            ))}
        </div>
    );
};

// 投稿ごとのコメントリスト
const CommentPost = ({
    post,
    sortType,
    currentUserId,
    navigate,
    handleDelete,
    handleFollow,
    openReportModal
}) => {
    const [comments, setComments] = useState(post.my_comments || []);
    const { handleDelete: handleCommentDelete, handleLike } =
        useCommentActions(setComments, navigate);

    useEffect(() => {
        setComments(post.my_comments || []);
    }, [post.my_comments]);

    if (!comments || comments.length === 0) return null;

    // コメントの並び替え（内部仕様）
    const sortedComments = [...comments].sort((a, b) => {
        if (sortType === "like") {
            return (b.like_count ?? 0) - (a.like_count ?? 0);
        }

        if (sortType === "comment") {
            const aReplies = a.children?.length ?? 0;
            const bReplies = b.children?.length ?? 0;
            return bReplies - aReplies;
        }

        return new Date(b.created_at) - new Date(a.created_at);
    });

    return (
        <section className="MyCommentPost">
            {/* 投稿ヘッダー */}
            <div className="MyCommentPost__head">
                <div className="MyCommentPost__author">
                    <UserProfile
                        user={{ icon_image: post.author_icon }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/mypage/${post.post_user}`);
                        }}
                    />
                    <div className="MyCommentPost__meta">
                        <div className="MyCommentPost__name">{post.author_name}</div>
                    </div>
                </div>

                <div className="MyCommentPost__menu">
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
                            isReported: post.is_reported,
                        }}
                    />
                </div>
            </div>

            {/* 投稿タイトル */}
            <div className="MyCommentPost__title">{post.title}</div>

            {/* コメント一覧 */}
            <div className="MyCommentPost__comments">
                {sortedComments.map((c) => (
                    <CommentItem
                        key={c.comment_id}
                        comment={c}
                        currentUserId={currentUserId}
                        navigate={navigate}
                        handleDelete={() => handleCommentDelete(c.comment_id)}
                        handleLike={() => handleLike(c.comment_id)}
                        handleFollow={() => handleFollow(c.user)}
                        openReportModal={() => openReportModal(c.comment_id, "comment")}
                        updateComment={(updated) => {
                            setComments((prev) =>
                                prev.map((com) =>
                                    com.comment_id === updated.comment_id ? updated : com
                                )
                            );
                        }}
                        onReplyClick={() => { }}
                    />
                ))}
            </div>
        </section>
    );
};

export default MyCommentList;