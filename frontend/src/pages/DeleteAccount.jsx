import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";

const DeleteAccount = () => {
    const navigate = useNavigate();


    // 削除処理
    const handleDelete = async () => {
        const finalConfirm = window.confirm(
            "本当にアカウントを削除しますか？\nこの操作を行うと全てのデータが即座に消去されます。"
        );

        // キャンセルされたら何もしない
        if (!finalConfirm) return;

        try {
            await axiosPrivate.delete("/api/users/delete/");
            alert("アカウントを完全に削除しました。");
            
            // ログアウト処理
            localStorage.clear();
            window.location.href = "/login"; 
        } catch (err) {
            console.error(err);
            alert("削除に失敗しました。");
        }
    };



    return (
        <div>
            <h2>アカウント削除の確認</h2>
            <p>本当にアカウントを削除しますか？</p>
            <p>
                これまでの投稿、コメント、いいねなどのデータはすべて消去され、元に戻すことはできません。
            </p>
            
            <div>
                {/* 前の画面に戻る */}
                <button onClick={() => navigate(-1)}> 
                    {/* 戻る矢印ボタンここ */}
                    キャンセルして戻る
                </button>
                
                <button onClick={handleDelete}>同意してアカウントを削除する</button>
            </div>
        </div>
    );
};

export default DeleteAccount;
