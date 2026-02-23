import { useState, useRef, useCallback } from "react";
import Heart from "@/assets/images/icon/heart.svg?react";
import CommentIcon from "@/assets/images/icon/comment.svg?react";

import MenuButton from "./MenuButton";
import UserProfile from "./UserProfile";
import "quill/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axiosPrivate from "@/api/axiosPrivate";
import { useCommentQuillModules, commentFormats } from "@/utils/commentQuillConfig";

import { useFxKey } from "@/hooks/useFxKey";
import Ripple from "@/components/effects/Ripple";
import Burst from "@/components/effects/Burst";


import "./commentItem.css"

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
    onReplyClick = () => { },
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const quillRef = useRef(null);
    const { fxKey, showFx, triggerFx } = useFxKey();

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
        <div className="commentItem click_area">
            <div className="dai_flex">
                <div className="syo_flex">
                    {/* コメントアイコン */}
                    <div className="aaa">
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
                    </div>

                    {/* ユーザー名 */}
                    <p>{comment.comment_author_name}</p>

                    {/* 作成日時 */}
                    <p className="date">{formatCommentDate(comment.created_at)}</p>

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
                        />
                        <div>
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
                    />
                )}
            </div>

            <div className="comment_flex">
                {/* <button
                    onClick={(e) => { e.stopPropagation(); handleLike(comment.comment_id); }}
                    className={`icon_flex ${comment.liked ? "red" : "gray"}`}
                >
                    <Heart />
                    <span>{comment.like_count}</span>
                </button> */}

                <button
                    onClick={(e) => {
                        e.stopPropagation();

                        // 未いいね → いいね の時だけ発火（redになる瞬間だけ）
                        if (!comment.liked) triggerFx(450);

                        handleLike(comment.comment_id);
                    }}
                    className={`icon_flex likeBtn ${comment.liked ? "red" : "gray"}`}
                    style={{
                        "--ripple-inset": "-10px",
                        "--ripple-scale": "1.2",
                        "--ripple-opacity": "0.18",
                    }}
                >
                    {showFx && <><Ripple fxKey={fxKey} /><Burst fxKey={fxKey} spread={34} size={4} duration={520} /></>}

                    <Heart className="fx-foreground" />
                    <span>{comment.like_count}</span>
                </button>

                {/* 親コメント（parent_commentがnull）の時だけ表示 */}
                {comment.parent_comment === null && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onReplyClick(comment); }}
                        className="icon_flex"

                    >
                        <CommentIcon className="icon" />
                        <span>返信</span>
                    </button>


                )}


            </div>
        </div>
    );
};

export default CommentItem;
