import axiosPrivate from "@/api/axiosPrivate";
import { useFollow } from "@/hooks/useFollow";

export const useCommentActions = (setComments, navigate) => {
    const { toggleFollow } = useFollow();

    // 更新
    const updateRecursive = (list, commentId, updateFn) => {
        return list.map((c) => {
            if (c.comment_id === commentId) {
                return updateFn(c);
            }
            if (c.children && c.children.length > 0) {
                return { ...c, children: updateRecursive(c.children, commentId, updateFn) };
            }
            return c;
        });
    };

    // いいね処理
    const handleLike = async (commentId) => {
        try {
            const res = await axiosPrivate.post(`/api/comments/${commentId}/like/`);
            
            setComments((prev) => 
                updateRecursive(prev, commentId, (c) => ({ ...c, ...res.data }))
            );
        } catch (err) {
            console.error("Like error:", err);
        }
    };

    // 編集
    const handleEdit = (commentId) => {
        navigate(`/comments/edit/${commentId}`);
    };


    // 削除
    const handleDelete = async (commentId) => {
        if (!window.confirm("このコメントを削除してもよろしいですか？")) return;
        try {
            await axiosPrivate.delete(`/api/comments/${commentId}/delete/`);
            
            const removeFromList = (list) =>
                list.filter((c) => c.comment_id !== commentId)
                    .map((c) => ({
                        ...c,
                        children: c.children ? removeFromList(c.children) : c.children
                    }));

            setComments((prev) => removeFromList(prev));
            alert("削除しました");
        } catch (err) {
            console.error(err);
            alert("削除に失敗しました");
        }
    };


    // フォロー処理
    const handleFollow = async (userId) => {
        try {
            const followed = await toggleFollow(userId);

            alert(followed ? "フォローしました。" : "フォローを解除しました。");

            const updateFollowRecursive = (list) =>
                list.map((c) => {
                    if (Number(c.user) === Number(userId)) {
                        return { ...c, is_followed: followed };
                    }
                    if (c.children && c.children.length > 0) {
                        return {
                            ...c,
                            children: updateFollowRecursive(c.children),
                        };
                    }
                    return c;
                });

            setComments((prev) => updateFollowRecursive(prev));

        } catch (err) {
            console.error("Follow error:", err);
            alert("フォロー処理に失敗しました。");
        }
    };



    return { handleEdit, handleDelete, handleLike, handleFollow};
};


