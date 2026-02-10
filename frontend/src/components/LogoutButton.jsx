import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate()

    // ログアウトボタンクリックされたらログイン画面へ
    const handleLogout = () => {
        // トークン削除
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <button onClick={handleLogout}>
            ログアウト
        </button>
    )
}

export default LogoutButton