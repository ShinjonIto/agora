import { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

export const usePostActions = (setPost, navigate) => {
    const [reportTarget, setReportTarget] = useState(null);

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
            await axiosPrivate.post(`/api/follows/${userId}/`);
            setPost(prev => {
                if (Array.isArray(prev)) {
                    return prev.map(p => p.post_user === userId ? { ...p, is_followed: !p.is_followed } : p);
                }
                return { ...prev, is_followed: !prev.is_followed };
            });
        } catch (err) {
            console.error("Follow error", err);
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
