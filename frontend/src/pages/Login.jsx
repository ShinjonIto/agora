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
                username: form.student_number, // ← Signup と違うのはここだけ
                password: form.password,
            });

            localStorage.setItem("token", res.data.token);

            // ユーザーIDも保存
            localStorage.setItem("userId", res.data.user_id);

            navigate("/");         // ログイン成功したらHomeへ
        } catch (err) {
            console.error(err);
            setSubmitErrors("ログインに失敗しました");
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

                <Link to="/password">パスワードを忘れた場合はこちら</Link>
                <Link to="/signup">新規会員登録</Link>
            </form>
        </div>
    );
};

export default Login;
