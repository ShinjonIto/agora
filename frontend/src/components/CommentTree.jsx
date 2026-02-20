import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import "./CommentTree.css";

export default function CommentTree({
    comment,
    postId,
    currentUserId,
    navigate,
    setComments,
    replyTarget,
    setReplyTarget,
    handleCommentDelete,
    commentActions,
    updateCommentInTree,
    setReportTarget,
    handleCommentSuccess,
    depth = 0,
}) {
    const isReplying = replyTarget && Number(replyTarget.comment_id) === Number(comment.comment_id);

    return (
        <div className="cmt">
            {/* コメント本体（ここに node を描く） */}
            <div className="cmt__line">
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
                    updateComment={(updated) => setComments((prev) => updateCommentInTree(prev, updated))}
                    openReportModal={(id) => setReportTarget({ type: "comment", id })}
                />
            </div>

            {/* 返信フォーム */}
            {isReplying && (
                <div className="cmt__reply">
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
                    <button className="cmt__cancel" onClick={() => setReplyTarget(null)}>
                        キャンセル
                    </button>
                </div>
            )}

            {/* 子コメント（ここに “縦線” を立てる） */}
            {comment.children?.length > 0 && (
                <div className="cmt__children">
                    {comment.children.map((child) => (
                        <CommentTree
                            key={child.comment_id}
                            comment={child}
                            postId={postId}
                            currentUserId={currentUserId}
                            navigate={navigate}
                            setComments={setComments}
                            replyTarget={replyTarget}
                            setReplyTarget={setReplyTarget}
                            handleCommentDelete={handleCommentDelete}
                            commentActions={commentActions}
                            updateCommentInTree={updateCommentInTree}
                            setReportTarget={setReportTarget}
                            handleCommentSuccess={handleCommentSuccess}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}