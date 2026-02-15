import { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import { useFollow } from "@/hooks/useFollow";

export const usePostActions = (setPost, navigate, setComments = null) => {
    const [reportTarget, setReportTarget] = useState(null);
    const { toggleFollow } = useFollow();

    // 削除処理
    const handleDelete = async (id) => {
        if (!window.confirm("投稿を削除しますか？")) return;
        try {
            await axiosPrivate.delete(`/api/posts/${id}/`);
            if (navigate) navigate("/posts");
        } catch (err) {
            alert("削除に失敗しました");
        }
    };


    // いいね処理
    const handleLike = async (id) => {
        try {
            const res = await axiosPrivate.post(`/api/posts/${id}/like/`);
            // setPostが「単一オブジェクト」か「配列」かで更新処理を分ける
            setPost(prev => {
                if (Array.isArray(prev)) {
                    return prev.map(p => p.post_id === id ? { ...p, ...res.data } : p);
                }
                return { ...prev, ...res.data };
            });
        } catch (err) {
            console.error("Like error", err);
        }
    };


    // フォロー処理
    const handleFollow = async (userId) => {
        try {
            const followed = await toggleFollow(userId);
            if (setPost) {
                setPost(prev => {
                    if (Array.isArray(prev)) {
                        return prev.map(p =>
                            Number(p.post_user) === Number(userId)
                                ? { ...p, is_followed: followed }
                                : p
                        );
                    }

                    return prev && Number(prev.post_user) === Number(userId)
                        ? { ...prev, is_followed: followed }
                        : prev;
                });
            }

            // コメント同期（詳細画面用）
            if (setComments) {
                setComments(prev => {
                    const syncRecursive = (list) =>
                        list.map(c => {
                            let updated = { ...c };

                            if (Number(c.user) === Number(userId)) {
                                updated.is_followed = followed;
                            }

                            if (c.children?.length > 0) {
                                updated.children = syncRecursive(c.children);
                            }

                            return updated;
                        });

                    return syncRecursive(prev);
                });
            }

            alert(followed ? "フォローしました。" : "フォローを解除しました。");

            return followed;

        } catch (err) {
            console.error("Follow sync error:", err);
            alert("フォロー処理に失敗しました。");
        }
    };




    // 通報完了時の処理（ボタンを「通報済み」に変える）
    const handleReportSuccess = (id) => {
        setPost(prev => {
            if (Array.isArray(prev)) {
                return prev.map(p => p.post_id === id ? { ...p, is_reported: true } : p);
            }
            return { ...prev, is_reported: true };
        });
    };


    // 日付
    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "今日 " + postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return "昨日";
        return postDate.toLocaleDateString();
    };

    return {handleDelete, handleLike, handleFollow, 
        formatPostDate, reportTarget, setReportTarget, handleReportSuccess 
    };
};
