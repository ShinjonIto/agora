import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";
import FormInput from "../components/form/FormInput";
import { validateField, validateAll } from "../utils/validation";
import { getFormStatus } from "../utils/formState";

import "./authPages.css"

const Signup = () => {
    const navigate = useNavigate();
    // 空箱
    const [form, setForm] = useState({
        student_number: "",
        user_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });
    const [errors, setErrors] = useState({
        student_number: "",
        user_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });



    // フォーム全体のエラー
    const [submitErrors, setSubmitErrors] = useState("");
    const { canSubmit } = getFormStatus(form, errors);
    // 入力されたinputを特定
    const handleChange = (e) => {
        const { name, value } = e.target;

        // フォームの更新　　...form … 今までの
        const nextForm = { ...form, [name]: value };
        setForm(nextForm);

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value, nextForm),
        }));

        // password変更時は confirm も再チェックしてズレ防止
        if (name === "password" && nextForm.confirm_password) {
            setErrors((prev) => ({
                ...prev,
                confirm_password: validateField("confirm_password", nextForm.confirm_password, nextForm),
            }));
        }
    };

    // 送信　ページリロードを防ぐ
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitErrors("");

        const nextErrors = validateAll(form);
        setErrors(nextErrors);

        const status = getFormStatus(form, nextErrors);
        if (!status.canSubmit) {
            setSubmitErrors(status.message);
            return;
        }

        try {
            await axiosPublic.post("/api/users/signup/", form);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setSubmitErrors("登録に失敗しました");
        }





    };



    return (
        <div className="authPages">
            {/* ✕ボタン */}
            <Link to="/login" >
                ✕
            </Link>

            <h2>会員登録</h2>

            {/* 全体エラー */}
            {submitErrors && <p>{submitErrors}</p>}


            <form onSubmit={handleSubmit} >
                <div>
                    <FormInput
                        name="user_name"
                        placeholder="ユーザー名"
                        value={form.user_name}
                        error={errors.user_name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <FormInput
                        name="student_number"
                        placeholder="学生番号"
                        value={form.student_number}
                        error={errors.student_number}
                        onChange={handleChange}
                    />

                </div>

                <div>
                    <FormInput
                        type="email"
                        name="email"
                        placeholder="メールアドレス"
                        error={errors.email}
                        value={form.email}
                        onChange={handleChange}

                    />

                </div>

                <div>
                    <FormInput
                        type="password"
                        name="password"
                        placeholder="パスワード"
                        error={errors.password}
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                </div>

                <div>
                    <FormInput
                        type="password"
                        name="confirm_password"
                        placeholder="パスワード再入力"
                        error={errors.confirm_password}
                        value={form.confirm_password}
                        onChange={handleChange}
                        required
                    />

                </div>

                <button
                    type="submit"
                    className={`button ${canSubmit ? "ok_button" : "no_button"}`}
                    disabled={!canSubmit}
                >
                    登録
                </button>

                <Link to="/login" >
                    ログインはこちら
                </Link>


            </form>


        </div>
    );
};

export default Signup;
