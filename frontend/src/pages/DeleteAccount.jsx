import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import { Link } from "react-router-dom";

import "./authPages.css";

const DeleteAccount = () => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        const finalConfirm = window.confirm(
            "本当にアカウントを削除しますか？\nこの操作を行うと全てのデータが即座に消去されます。"
        );

        if (!finalConfirm) return;

        try {
            await axiosPrivate.delete("/api/users/delete/");
            alert("アカウントを完全に削除しました。");

            localStorage.clear();
            window.location.href = "/login";
        } catch (err) {
            console.error(err);
            alert("削除に失敗しました。");
        }
    };

    return (
        <div className="authPages">

            <div className="form">

                <p className="delete_text">
                    本当にアカウントを削除しますか？
                </p>

                <p className="delete_text small">
                    これまでの投稿、コメント、いいねなどのデータはすべて消去され、元に戻すことはできません。
                </p>

                <div className="links">
                    <button
                        type="button"
                        className="button no_button"
                        onClick={() => navigate(-1)}
                    >
                        キャンセルして戻る
                    </button>

                    <button
                        type="button"
                        className="button danger_button"
                        onClick={handleDelete}
                    >
                        同意して削除
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DeleteAccount;