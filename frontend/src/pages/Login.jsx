import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";
import "./login.css"

// 画像
import Sakaki from "@/assets/images/account/sakaki.png";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Djangoにusername(学生番号)とpasswordを送信
            const res = await axiosPublic.post("/api/users/login/", {
                username,
                password,
            });

            // トークンをブラウザに保存
            localStorage.setItem("token", res.data.token);
            // ユーザーIDも保存
            localStorage.setItem("userId", res.data.user_id);

            navigate("/");         // ログイン成功したらHomeへ
        } catch (err) {
            alert("ログイン失敗");
        }
    };

    return (

        <div className="login">
            <h1>Login</h1>
            <div className="account">

                <input placeholder="学生番号" onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="パスワード" onChange={e => setPassword(e.target.value)} />
                <button onClick={handleLogin}>Login</button>
                <Link to="/signup">
                    新規会員登録
                </Link>
                <Link to="/signup">
                    新規会員登録
                </Link>


            </div>
            <div className="sakaki"><img src={Sakaki} /></div>
        </div>
    );
};

export default Login;