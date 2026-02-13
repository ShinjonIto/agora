import React, { useState, useEffect, useRef } from "react";

// スタイル定義
const btnStyle = {
    display: "block", width: "100%", padding: "10px 12px", border: "none",
    background: "none", textAlign: "left", cursor: "pointer", fontSize: "14px", color: "#333",
};

const MenuButton = ({
    type,
    targetId,
    ownerId,
    currentUserId,
    setIsMenuOpen,
    handlers: {
        onEdit,
        onDelete,
        onReport,
        onFollow,
        isFollowed,
        isReported,
    },
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const isMine = currentUserId && String(ownerId) === String(currentUserId);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);
                if (type === "post" && setIsMenuOpen) setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [type, setIsMenuOpen]);

    // 閉じる処理の共通化
    const closeMenu = () => {
        setIsOpen(false);
        if (type === "post" && setIsMenuOpen) setIsMenuOpen(false);
    };

    return (
        <div style={{ position: "relative" }} ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(prev => {
                        const next = !prev;

                        if (type === "post" && setIsMenuOpen) setIsMenuOpen(next);
                        return next;
                    });
                }}
                style={{ 
                    background: "red", color: "yellow", border: "3px solid blue", 
                    fontSize: "30px", width: "40px", height: "40px", zIndex: 9999, position: "relative" 
                }}
            >
                ⋮
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute", right: 0, top: "45px", background: "white",
                        border: "1px solid #ccc", zIndex: 100, minWidth: "120px",
                        borderRadius: "4px", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", overflow: "hidden"
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {isMine ? (
                        <div>
                            <button style={btnStyle} onClick={() => { onEdit?.(targetId); closeMenu(); }}>編集</button>
                            <button style={{ ...btnStyle, color: "red" }} onClick={() => { onDelete?.(targetId); closeMenu(); }}>削除</button>
                        </div>
                    ) : (
                        <div>
                            {onFollow && (
                                <button style={btnStyle} onClick={() => { onFollow(ownerId); }}>
                                    {isFollowed ? "フォロー解除" : "フォロー"}
                                </button>
                            )}
                            {isReported ? (

                                <button disabled style={{ ...btnStyle, color: "gray", cursor: "not-allowed" }}>通報済み</button>

                            ) : (
                                <button style={btnStyle} onClick={() => { onReport?.(targetId); closeMenu(); }}>通報する</button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MenuButton;
