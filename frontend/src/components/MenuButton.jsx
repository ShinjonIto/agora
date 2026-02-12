import React, { useState, useEffect, useRef } from "react";

/**
 * 三点リーダーのメニュー
 * post / comment 両対応
 */
const MenuBotton = ({
    type,           // "post" | "comment"
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
    // メニューの開閉状態
    const [isOpen, setIsOpen] = useState(false);

    // 外側クリック判定用
    const menuRef = useRef(null);

    // 自分の投稿・コメントかどうか
    const isMine =
        currentUserId && String(ownerId) === String(currentUserId);

    /**
     * メニュー外をクリックしたら閉じる
     * post の場合のみ、親コンポーネントにも閉じたことを伝える
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsOpen(false);

                if (type === "post" && setIsMenuOpen) {
                    setIsMenuOpen(false);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [type, setIsMenuOpen]);

    return (
        <div style={{ position: "relative" }} ref={menuRef}>
            {/* 三点リーダーボタン */}
            <button
                onClick={(e) => {
                    // 親要素のクリック（ページ遷移）を止める
                    e.stopPropagation();

                    setIsOpen(!isOpen);

                    // post の場合のみ親に状態を渡す
                    if (type === "post" && setIsMenuOpen) {
                        setIsMenuOpen(!isOpen);
                    }
                }}
                style={{ background: "none", border: "none", cursor: "pointer" }}
            >
                ⋮
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
                        minWidth: "100px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    }}
                    // メニュー内クリックでも閉じないようにする
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 自分の投稿・コメントの場合 */}
                    {isMine ? (
                        <div>
                            <button
                                onClick={() => {
                                    onEdit?.(targetId);
                                    setIsOpen(false);
                                }}
                            >
                                編集
                            </button>
                            <button
                                onClick={() => {
                                    onDelete?.(targetId);
                                    setIsOpen(false);
                                }}
                            >
                                削除
                            </button>
                        </div>
                    ) : (
                        <div>
                            {/* post のときだけフォロー表示 */}
                            {type === "post" && onFollow && (
                                <button onClick={() => onFollow(ownerId)}>
                                    {isFollowed
                                        ? "フォロー解除"
                                        : "フォロー"}
                                </button>
                            )}

                            {/* 通報ボタン */}
                            {isReported ? (
                                <button disabled>通報済み</button>
                            ) : (
                                <button
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

export default MenuBotton;
