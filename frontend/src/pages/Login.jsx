import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";
import FormInput from "../components/form/FormInput";
import { validateField, validateAll } from "../utils/validation";
import { getFormStatus } from "../utils/formState";
import "./authPages.css";

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        student_number: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        student_number: "",
        password: "",
    });

    const [submitErrors, setSubmitErrors] = useState("");
    const { canSubmit } = getFormStatus(form, errors);

    const handleChange = (e) => {
        const { name, value } = e.target;

        const nextForm = { ...form, [name]: value };
        setForm(nextForm);

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value, nextForm),
        }));
    };


    
    // ログイン処理
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
            const res = await axiosPublic.post("/api/users/login/", {
                username: form.student_number,
                password: form.password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userId", res.data.user_id);

            // navigate("/"); // ログイン成功したらHomeへ
            window.location.href = "/";
        } catch (err) {
            console.error(err);

            // バックエンドからの detail メッセージを表示
            if (err.response && err.response.data && err.response.data.detail) {
                setSubmitErrors(err.response.data.detail);
            } else {
                setSubmitErrors("ユーザー名またはパスワードが正しくありません");
            }
        }
    };

    return (
        <div className="authPages">


            {submitErrors && <p className="errorText">{submitErrors}</p>}

            <form onSubmit={handleSubmit}>
                <FormInput
                    name="student_number"
                    value={form.student_number}
                    error={errors.student_number}
                    onChange={handleChange}
                />

                <FormInput
                    name="password"
                    value={form.password}
                    error={errors.password}
                    onChange={handleChange}
                    required
                />


                <button
                    type="submit"
                    className={`button ${canSubmit ? "ok_button" : "no_button"}`}
                    disabled={!canSubmit}
                >
                    ログイン
                </button>

                <div className="links">
                    <Link to="/signup" className="link_button">新規会員登録</Link>
                    <Link to="/password" className="link">パスワードを忘れた場合はこちら</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
