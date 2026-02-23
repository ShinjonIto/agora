import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/ui/Modal";
import "./logoutButton.css";

const LogoutButton = () => {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    console.log("typeof useState =", typeof useState);

    // ログアウトボタンクリックされたらログイン画面へ
    const handleLogout = () => {
        // トークン削除
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="logOut">
            <button onClick={() => setOpen(true)}>
                ログアウト
            </button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="ログアウトしますか？"
                size="sm"
            >
                <div className="AgoraPanel">
                    <button className="Panel_button" onClick={() => setOpen(false)}>
                        キャンセル
                    </button>
                    <button className="Panel_button" onClick={handleLogout}>
                        ログアウト
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default LogoutButton