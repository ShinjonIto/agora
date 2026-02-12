import { useState } from "react";

const MyCommentItem = ({ comment, navigate, handleCommentDelete, formatPostDate }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div style={{ marginLeft: "10px", padding: "5px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{comment.content}</span>
                
                {/* 三点リーダー */}
                <div style={{ position: "relative" }}>
                    <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>⋮</button>
                    {showMenu && (
                        <div style={{ position: "absolute", right: 0, background: "white", border: "1px solid #ccc", zIndex: 10 }}>
                            <button onClick={() => navigate(`/comments/edit/${comment.comment_id}`)}>編集</button>
                            <button onClick={() => { handleCommentDelete(comment.comment_id); setShowMenu(false); }}>削除</button>
                        </div>
                    )}
                </div>
            </div>
            <small style={{ color: "gray" }}>{formatPostDate(comment.created_at)}</small>
        </div>
    );
};

export default MyCommentItem;
