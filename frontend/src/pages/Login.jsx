import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
        // Djangoにusername(学生番号)とpasswordを送信
        const res = await axios.post("/api/users/login/", {
            username,
            password,
        });

        // トークンをブラウザに保存
        localStorage.setItem("token", res.data.token);

        navigate("/");         // ログイン成功したらHomeへ
        } catch (err) {
        alert("ログイン失敗");
        }
    };

    return (
        <div>
        <h1>Login</h1>
        <input placeholder="学生番号" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="パスワード" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <button onClick={() => navigate("/signup")}>会員登録はこちら</button>
        </div>
    );
};

export default Login;