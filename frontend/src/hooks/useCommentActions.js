import axiosPrivate from "@/api/axiosPrivate";

export const useCommentActions = (setComments, navigate) => {

    const handleEdit = (commentId) => {
        navigate(`/comments/edit/${commentId}`);
    };

    // 削除：API実行 + リストから消す
    const handleDelete = async (commentId) => {
        if (!window.confirm("このコメントを削除してもよろしいですか？")) return;
        try {
            await axiosPrivate.delete(`/api/comments/${commentId}/delete/`);
            
            // 再帰的にコメントを探して削除する共通ロジック
            const removeFromList = (list) =>
                list.filter((c) => c.comment_id !== commentId)
                    .map((c) => ({
                        ...c,
                        children: c.children ? removeFromList(c.children) : []
                    }));

            setComments((prev) => removeFromList(prev));
            alert("削除しました");
        } catch (err) {
            console.error(err);
            alert("削除に失敗しました");
        }
    };

    return { handleEdit, handleDelete };
};
