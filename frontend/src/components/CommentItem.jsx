import { useState, useRef, useCallback } from "react";
import Heart from "@/assets/images/icon/heart.svg?react";
import CommentIcon from "@/assets/images/icon/comment.svg?react";
import "./PostCard.css"; 
import MenuButton from "./MenuButton";
import UserProfile from "./UserProfile";
import "quill/dist/quill.snow.css"; 
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axiosPrivate from "@/api/axiosPrivate";
import { useCommentQuillModules, commentFormats } from "@/utils/commentQuillConfig";

// 日付
const formatCommentDate = (dateString) => {
    if (!dateString) return "";
    const postDate = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "今日 " + postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return "昨日";
    return postDate.toLocaleDateString();
};


const CommentItem = ({
    comment,
    currentUserId,
    navigate,
    handleDelete,
    handleLike,
    handleFollow,
    openReportModal,
    updateComment,
    onReplyClick = () => {},
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const quillRef = useRef(null);


    // 画像アップロード
    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const res = await axiosPrivate.post("/api/posts/upload_image/", formData);
                const url = res.data.url;

                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    quill.insertEmbed(range ? range.index : quill.getLength(), "image", url);
                }
            } catch (err) {
                console.error("Upload error:", err);
                alert("画像のアップロードに失敗しました");
            }
        };
    }, []);

    const modules = useCommentQuillModules(imageHandler);

    // 親コメントかどうかの判定（Djangoのparent_commentフィールドがnullなら親）
    const isParent = comment.parent_comment === null;


    // 編集処理
    const handleEditSave = async () => {
        try {
            const res = await axiosPrivate.patch(
                `/api/comments/${comment.comment_id}/edit/`,
                { content: editContent }
            );
            if (res.status === 200 && res.data) {
                const updatedComment = res.data;
                // 親の state 更新
                updateComment(updatedComment);
                // 自分自身も更新
                setEditContent(updatedComment.content);
                setIsEditing(false);
                alert("コメントの編集に成功しました。")
            } else {
                console.error("編集失敗 status:", res.status);
                alert("編集の保存に失敗しました");
            }
        } catch (err) {
            console.error("通信失敗 catch:", err);
            alert("編集の保存に失敗しました");
        }
    };


    return (
        <div className="comment-item">
            <div className="dai_flex">
                <div className="syo_flex">
                    {/* コメントアイコン */}
                    <UserProfile
                        user={{ 
                            icon_image: comment.comment_author_icon, 
                            id: comment.comment_author_id 
                        }}
                        onClick={(e) => {
                            e.stopPropagation(); // 親のクリックイベントを止める
                            navigate(`/mypage/${comment.comment_author_id}`);
                        }}
                        />

                    {/* ユーザー名 */}
                    <p>{comment.comment_author_name}</p>

                    {/* 作成日時 */}
                    <p>{formatCommentDate(comment.created_at)}</p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <MenuButton
                        type="comment"
                        targetId={comment.comment_id}
                        ownerId={comment.user}
                        currentUserId={currentUserId}
                        setIsMenuOpen={setIsMenuOpen}
                        handlers={{
                            // 編集押されたら
                            onEdit: () => setIsEditing(true),
                            onDelete: handleDelete,
                            onReport: openReportModal,
                            onFollow: handleFollow, 
                            isFollowed: comment.is_followed,
                            isReported: comment.is_reported,
                        }}
                    />
                </div>
            </div>

            {/* リッチテキスト表示・編集ボタン押されたらフォームに切り替え */}
            <div className="honbun">
                {isEditing ? (
                    <div>
                    {/* フォーム */}
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={editContent}
                        onChange={setEditContent}
                        modules={modules}
                        formats={commentFormats}
                        placeholder="コメントを入力..."
                        style={{ backgroundColor: "white", color: "black", borderRadius: "8px"}}
                    />
                    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                        <button onClick={handleEditSave}>保存</button>
                        <button onClick={() => {
                        setIsEditing(false);
                        setEditContent(comment.content);
                        }}>
                        キャンセル
                        </button>
                    </div>
                    </div>
                ) : (
                    <div
                    className="ql-editor"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                    style={{ padding: "10px 0" }}
                    />
                )}
                </div>

            <div className="comment_flex" style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                <button onClick={(e) => { e.stopPropagation(); handleLike(comment.comment_id); }}>
                    <Heart style={{ width: "16px" }} />
                    {comment.like_count}
                </button>

                {/* 親コメント（parent_commentがnull）の時だけ表示 */}
                {comment.parent_comment === null && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onReplyClick(comment); }}
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", color: "gray" }}
                    >
                        <CommentIcon style={{ width: "16px" }} />
                        <span>返信</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
