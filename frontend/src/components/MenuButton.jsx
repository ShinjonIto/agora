import React, { useState, useEffect, useRef } from "react";

// メニュー内のボタン共通スタイル
const btnStyle = {
    display: "block",
    width: "100%",
    padding: "10px 12px",
    border: "none",
    background: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#333", // 背景が白なので文字は暗く
};

const MenuButton = ({
    type,
    targetId,
    ownerId,
    currentUserId,
    handlers: {
        onEdit,
        onDelete,
        onReport,
        onFollow,
        isFollowed,
        isReported,
        setIsMenuOpen,
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

    return (
        <div style={{ position: "relative" }} ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(prev => {
                        const next = !prev;
                        if (type === "post" && setIsMenuOpen) {
                            setIsMenuOpen(next);
                        }
                        return next;
                    });
                }}

            >
                ...
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "25px",
                        background: "white",
                        border: "1px solid #ccc",
                        zIndex: 100,
                        minWidth: "120px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        overflow: "hidden" // 角の丸みをボタンにも適用
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {isMine ? (
                        <div>
                            <button style={btnStyle} onClick={() => { onEdit?.(targetId); setIsOpen(false); }}>編集</button>
                            <button style={{ ...btnStyle, color: "red" }} onClick={() => { onDelete?.(targetId); setIsOpen(false); }}>削除</button>
                        </div>
                    ) : (
                        <div>
                            {/* フォローボタン (type条件を外したのでコメントでも出る) */}
                            {onFollow && (
                                <button style={btnStyle} onClick={() => { onFollow(ownerId); }}>
                                    {isFollowed ? "フォロー解除" : "フォロー"}
                                </button>
                            )}

                            {/* 通報ボタン */}
                            {isReported ? (
                                <button
                                    disabled
                                    style={{ ...btnStyle, color: "gray", cursor: "not-allowed" }}
                                >
                                    通報済み
                                </button>
                            ) : (
                                <button
                                    style={btnStyle}
                                    onClick={() => {
                                        onReport?.(targetId);
                                        setIsOpen(false);
                                    }}
                                >
                                    通報する
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MenuButton;
