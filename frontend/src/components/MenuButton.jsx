import React, { useState, useEffect, useRef } from "react";

const MenuBotton = ({ 
    type,           // "post" or "comment"
    targetId,       // 記事ID or コメントID
    ownerId,        // 投稿者のID
    currentUserId,  // ログイン中のユーザーID
    handlers: { 
        onEdit, 
        onDelete, 
        onReport, 
        onFollow, 
        isFollowed ,
        isReported 
    } 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // 自分のものか判定
    const isMine = currentUserId && String(ownerId) === String(currentUserId);

    // 外側クリックで閉じる
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    return (
        <div style={{ position: "relative" }} ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                ⋮
            </button>

            {isOpen && (
                <div style={{ 
                    position: "absolute", right: 0, top: "25px", background: "white", 
                    border: "1px solid #ccc", zIndex: 100, minWidth: "100px", borderRadius: "4px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                }}>
                    {isMine ? (
                        <div>
                            <button onClick={() => { onEdit(targetId); setIsOpen(false); }}>編集</button>
                            <button onClick={() => { onDelete(targetId); setIsOpen(false); }}>削除</button>
                        </div>
                    ) : (
                        <div>
                            {onFollow && (
                                <button onClick={() => { onFollow(ownerId); setIsOpen(false); }}>
                                    {isFollowed ? "フォロー解除" : "フォロー"}
                                </button>
                            )}
                            {isReported ? (
                                <button disabled>通報済み</button>
                            ) : (
                                <button onClick={() => { onReport(targetId); setIsOpen(false); }}>通報する</button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export default MenuBotton;
