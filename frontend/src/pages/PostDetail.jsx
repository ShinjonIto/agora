import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import PostCard from "@/components/PostCard";
import CommentItem from "../components/CommentItem";    // コメント
import CommentForm from "../components/CommentForm";    // コメントフォーム
import { usePostActions } from "@/hooks/usePostActions";
import { useCommentActions } from "@/hooks/useCommentActions";
import ReportModal from "@/components/ReportModal";
import "./PostDetail.css"




const PostDetail = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [replyTarget, setReplyTarget] = useState(null);
    const [reportTarget, setReportTarget] = useState(null);


    // ユーザーID
    const currentUserId = Number(localStorage.getItem("userId"));

    // フック
    const { handleDelete, handleLike, handleFollow, formatPostDate } = usePostActions(setPost, navigate, setComments);

    const commentActions = useCommentActions(setComments, navigate);

    // 削除
    const handlePostDelete = async (id) => {
        const success = await handleDelete(id);
        if (success) {
            alert("削除しました");
            navigate("/");
        }
    };


    // コメント削除
    const handleCommentDelete = async (commentId) => {
        await commentActions.handleDelete(commentId); // useCommentActions の handleDelete を呼ぶ
        // コメント件数を減らす
        setPost(prev => ({
            ...prev,
            comment_count: Math.max((prev.comment_count || 1) - 1, 0)
        }));
    };


    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                // 記事取得
                const postRes = await axiosPrivate.get(`/api/posts/${postId}/`);
                setPost(postRes.data);

                // コメント取得
                const commentRes = await axiosPrivate.get(`/api/comments/${postId}/`);
                const data = commentRes.data;
                setComments(commentRes.data);


            } catch (err) {
                console.error(err);
                setError("記事またはコメントの取得に失敗しました");
            }
        };
        fetchPostAndComments();
    }, [postId]);


    // 編集の時、子要素に情報渡す
    const updateCommentInTree = (list, updated) => {
        return list.map(c => {
            if (c.comment_id === updated.comment_id) {
                return { ...c, ...updated };
            }
            if (c.children?.length > 0) {
                return { ...c, children: updateCommentInTree(c.children, updated) };
            }
            return c;
        });
    };



    // コメント件数を増やす関数
    const handleCommentSuccess = () => {
        setPost(prev => ({
            ...prev,
            comment_count: (prev.comment_count || 0) + 1
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
            <h3>コメント</h3>
            {comments.length === 0 ? (
                <p>コメントはまだありません</p>
            ) : (
                comments.map(comment => (
                    <div key={comment.comment_id}>
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
                            updateComment={(updated) => setComments(prev => updateCommentInTree(prev, updated))}
                            openReportModal={(id) => setReportTarget({ type: "comment", id })}
                        />

                        {/* 2. 返信フォームの表示ロジック */}
                        {replyTarget && replyTarget.comment_id === comment.comment_id && (
                            <div>
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
                                {/* 3. ボタンのタグ記述を修正 */}
                                <button
                                    onClick={() => setReplyTarget(null)}
                                >
                                    キャンセル
                                </button>
                            </div>
                        )}

                        {comment.children && comment.children.length > 0 && (
                            <div>
                                {comment.children.map(child => (
                                    <div key={child.comment_id}>

                                        <CommentItem
                                            key={child.comment_id}
                                            comment={child}
                                            setComments={setComments}
                                            postId={postId}
                                            currentUserId={currentUserId}
                                            navigate={navigate}
                                            handleDelete={handleCommentDelete}
                                            handleLike={commentActions.handleLike}
                                            handleFollow={commentActions.handleFollow}
                                            openReportModal={(id) => setReportTarget({ type: "comment", id })}
                                            onReplyClick={(c) => setReplyTarget(c)}
                                            updateComment={(updated) => setComments(prev => updateCommentInTree(prev, updated))}
                                        />
                                    </div>

                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* コメントフォーム */}
            <CommentForm postId={postId} setComments={setComments} onSuccess={handleCommentSuccess} />

            {/* 通報モーダル */}
            {
                reportTarget && (
                    <ReportModal
                        type={reportTarget.type}
                        targetId={reportTarget.id}
                        onClose={() => setReportTarget(null)}
                    />
                )
            }
        </div >
    );
};

export default PostDetail;
