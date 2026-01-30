import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Signup = ({ onClose }) => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        student_number : "",
        user_name : "", 
        email : "",
        password : "",
        confirm_password : "",
    });
    const [errors, setErrors] = useState({
        student_number : "",
        user_name : "", 
        email : "",
        password : "",
        confirm_password : "",
    });

    // フォーム全体のエラー
    const [submitErrors, setSubmitErrors] = useState("");

    // 入力されたinputを特定
    const handleChange = (e)  => {
        const {name, value} = e.target;

        // フォームの更新　　...form … 今までの
        setForm({ ...form, [name] : value });

        // リアルタイムバリデーション
        let errorMsg = "";

        switch (name) {
            case "student_number":
                // 数字判定も
                if (value.length < 9) {
                    errorMsg = "学生番号は9文字以上入力してください。";
                }
                break;
            case "email":
                if (value && !/^\S+@\S+\.\S+$/.test(value))
                    errorMsg = "有効なメールアドレスを入力してください。";
                break;
            case "password":
                if (value.length > 0 && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)) {
                    errorMsg = "パスワードは英数字6文字以上で入力してください";
                }
                break;
            case "confirm_password":
                if (value !== form.password) errorMsg = "パスワードが一致しません";
                break;
            default:
                break;
        }
        
        // 今入力された項目のエラーだけ更新 他のエラーは保持
        setErrors({ ...errors, [name]: errorMsg });
    };

    // 送信　ページリロードを防ぐ
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitErrors("");

        // formの中のキーを一つずつ取り出し、全ての入力が正しいかチェック
        for (const key in form) {
        if (!form[key]) {
            setSubmitErrors("すべての項目を入力してください");
            return;
        }
        if (errors[key]) {
            setSubmitErrors("入力内容を確認してください");
            return;
        }
        }

        try {
        const response = await axios.post("/api/users/signup/", form);
        console.log(response.data);
        navigate("/login"); // 登録成功したらログインページへ
        } catch (err) {
        console.error(err);
        setSubmitErrors("登録に失敗しました");
        }
    };

    return (
        <div>
        <div>
            {/* ✕ボタン */}
            <button onClick={onClose}>
            ✕
            </button>

            <h2>会員登録</h2>

            {/* 全体エラー */}
            {submitErrors && <p>{submitErrors}</p>}

            <form onSubmit={handleSubmit}>
            <div>
                <input
                type="text"
                name="user_name"
                placeholder="ユーザー名"
                value={form.user_name}
                onChange={handleChange}
                required
                />
                {errors.user_name && <p>{errors.user_name}</p>}
            </div>

            <div>
                <input
                type="text"
                name="student_number"
                placeholder="学生番号"
                value={form.student_number}
                onChange={handleChange}
                required
                />
                {errors.student_number && <p>{errors.student_number}</p>}
            </div>

            <div>
                <input
                type="email"
                name="email"
                placeholder="メールアドレス"
                value={form.email}
                onChange={handleChange}
                required
                />
                {errors.email && <p>{errors.email}</p>}
            </div>

            <div>
                <input
                type="password"
                name="password"
                placeholder="パスワード"
                value={form.password}
                onChange={handleChange}
                required
                />
                {errors.password && <p>{errors.password}</p>}
            </div>

            <div>
                <input
                type="password"
                name="confirm_password"
                placeholder="パスワード再入力"
                value={form.confirm_password}
                onChange={handleChange}
                required
                />
                {errors.confirm_password && <p>{errors.confirm_password}</p>}
            </div>

            <button
                type="submit"
            >
                登録
            </button>
            </form>

            <p>
            ログインはこちら{" "}
            <button onClick={() => navigate("/login")}>
                ログイン
            </button>
            </p>
        </div>
        </div>
    );
};

export default Signup;
