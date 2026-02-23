import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import "./authPages.css";


const PasswordChange = () => {
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const currentUserId = Number(localStorage.getItem("userId"));



    const handleSubmit = async (e) => {
        e.preventDefault();

        // 新しいパスワードの確認
        if (newPassword !== confirmPassword) {
            alert("新しいパスワードと確認用パスワードが一致しません");
            return;
        }

        try {
            await axiosPrivate.patch(`/api/users/settings/${currentUserId}/password/`, {
                current_password: currentPassword,
                new_password: newPassword,
            });

            alert("パスワードを変更しました");
            navigate(`/settings/${currentUserId}/`); // 成功したらマイページへ戻す
        } catch (err) {
            console.error(err);
            if (err.response?.status === 400) {
                alert(err.response.data.detail || "現在のパスワードが正しくありません");
            } else {
                alert("パスワード変更に失敗しました");
            }
        }
    };

    return (
        <div className="authPages">
            {/* ✕ボタン */}
            <div className="batu">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    aria-label="閉じる"
                >
                    ×
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <label className="label">
                    現在のパスワード<br />
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </label>

                <label className="label">
                    新しいパスワード<br />
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                </label>

                <label className="label">
                    新しいパスワード（確認<br />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                </label>

                <div className="links">
                    <button type="submit" className="button ok_button">
                        変更する
                    </button>

                    <button
                        type="button"
                        className="button"
                        onClick={() => navigate(`/settings/${currentUserId}`)}
                    >
                        戻る
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordChange;