import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import PostCard from "@/components/PostCard";
import CommentItem from "../components/CommentItem";
import CommentForm from "../components/CommentForm";
import { usePostActions } from "@/hooks/usePostActions";
import { useCommentActions } from "@/hooks/useCommentActions";
import ReportModal from "@/components/ReportModal";
import "./PostDetail.css";

const PostDetail = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [replyTarget, setReplyTarget] = useState(null);
    const [reportTarget, setReportTarget] = useState(null);

    const currentUserId = Number(localStorage.getItem("userId"));

    const { handleDelete, handleLike, handleFollow, formatPostDate } =
        usePostActions(setPost, navigate, setComments);

    const commentActions = useCommentActions(setComments, navigate);

    const handlePostDelete = async (id) => {
        const success = await handleDelete(id);
        if (success) {
            alert("削除しました");
            navigate("/");
        }
    };

    const handleCommentDelete = async (commentId) => {
        await commentActions.handleDelete(commentId);
        setPost((prev) => ({
            ...prev,
            comment_count: Math.max((prev.comment_count || 1) - 1, 0),
        }));
    };

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const postRes = await axiosPrivate.get(`/api/posts/${postId}/`);
                setPost(postRes.data);

                const commentRes = await axiosPrivate.get(`/api/comments/${postId}/`);
                setComments(commentRes.data);
            } catch (err) {
                console.error(err);
                setError("記事またはコメントの取得に失敗しました");
            }
        };
        fetchPostAndComments();
    }, [postId]);

    const updateCommentInTree = (list, updated) => {
        return list.map((c) => {
            if (c.comment_id === updated.comment_id) return { ...c, ...updated };
            if (c.children?.length > 0) {
                return { ...c, children: updateCommentInTree(c.children, updated) };
            }
            return c;
        });
    };

    const handleCommentSuccess = () => {
        setPost((prev) => ({
            ...prev,
            comment_count: (prev.comment_count || 0) + 1,
        }));
    };

    if (error) return <p>{error}</p>;
    if (!post) return <p>Loading...</p>;

    return (
        <div className="postDetail">
            {/* 記事 */}
            <PostCard
                post={post}
                currentUserId={currentUserId}
                isReported={post.is_reported}
                navigate={navigate}
                handleDelete={handlePostDelete}
                handleLike={handleLike}
                handleFollow={handleFollow}
                formatPostDate={formatPostDate}
                openReportModal={(id) => setReportTarget({ type: "post", id })}
                variant="detail"
            />

            {/* コメント */}
            <section className="PostDetailComments">
                <div className="PostDetailComments__head">
                    <h3 className="PostDetailComments__title">コメント</h3>
                    <div className="PostDetailComments__count">
                        {post.comment_count ?? comments.length}件
                    </div>
                </div>

                <div className="PostDetailComments__list">
                    {comments.length === 0 ? (
                        <p className="PostDetailComments__empty">コメントはまだありません</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.comment_id} className="CommentNode is-root">
                                <div className="CommentNode__item">
                                    <CommentItem
                                        comment={comment}
                                        setComments={setComments}
                                        postId={postId}
                                        currentUserId={currentUserId}
                                        navigate={navigate}
                                        handleDelete={handleCommentDelete}
                                        handleLike={commentActions.handleLike}
                                        handleFollow={commentActions.handleFollow}
                                        onReplyClick={(c) => setReplyTarget(c)}
                                        updateComment={(updated) =>
                                            setComments((prev) => updateCommentInTree(prev, updated))
                                        }
                                        openReportModal={(id) =>
                                            setReportTarget({ type: "comment", id })
                                        }
                                    />
                                </div>

                                {/* 返信フォーム */}
                                {replyTarget &&
                                    replyTarget.comment_id === comment.comment_id && (
                                        <div className="CommentNode__replyBox">
                                            <div className="CommentNode__replyForm">
                                                <CommentForm
                                                    postId={postId}
                                                    parentCommentId={comment.comment_id}
                                                    replyTargetName={comment.comment_author_name}
                                                    setComments={setComments}
                                                    onSuccess={() => {
                                                        setReplyTarget(null);
                                                        handleCommentSuccess();
                                                    }}
                                                />
                                            </div>

                                            <div className="CommentNode__replyActions">
                                                <button
                                                    type="button"
                                                    className="CommentNode__cancelBtn click_area"
                                                    onClick={() => setReplyTarget(null)}
                                                >
                                                    キャンセル
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                {/* 子コメント */}
                                {comment.children && comment.children.length > 0 && (
                                    <div className="CommentNode__children">
                                        {comment.children.map((child) => (
                                            <div
                                                key={child.comment_id}
                                                className="CommentNode is-child"
                                                style={{
                                                    // ✅ 子コメントは浅いインデント。深くしすぎない
                                                    "--indent": "14px",
                                                }}
                                            >
                                                <div className="CommentNode__item">
                                                    <CommentItem
                                                        comment={child}
                                                        setComments={setComments}
                                                        postId={postId}
                                                        currentUserId={currentUserId}
                                                        navigate={navigate}
                                                        handleDelete={handleCommentDelete}
                                                        handleLike={commentActions.handleLike}
                                                        handleFollow={commentActions.handleFollow}
                                                        openReportModal={(id) =>
                                                            setReportTarget({ type: "comment", id })
                                                        }
                                                        onReplyClick={(c) => setReplyTarget(c)}
                                                        updateComment={(updated) =>
                                                            setComments((prev) =>
                                                                updateCommentInTree(prev, updated)
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* コメントフォーム（親） */}
                <div className="PostDetailComments__new">
                    <CommentForm
                        postId={postId}
                        setComments={setComments}
                        onSuccess={handleCommentSuccess}
                    />
                </div>
            </section>

            {/* 通報モーダル */}
            {reportTarget && (
                <ReportModal
                    type={reportTarget.type}
                    targetId={reportTarget.id}
                    onClose={() => setReportTarget(null)}
                />
            )}
        </div>
    );
};

export default PostDetail;