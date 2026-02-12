import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";
// ｃｓｓ
import "./authPages.css"



const Password = () => {
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

            navigate("/");         // ログイン成功したらHomeへ
        } catch (err) {
            alert("ログイン失敗");
        }
    };

    return (

        <div className="authPages">


            <Link to="/login" >
                ✕
            </Link>

            <h1>パスワードを変更する</h1>

            <form onSubmit={(e) => { e.preventDefault(); }}>

                <FormInput
                    name="student_number"
                    value={form.student_number}
                    error={errors.student_number}
                    onChange={handleChange}
                />
                <button>変更</button>

            </form>
        </div>
    );
};

export default Password;