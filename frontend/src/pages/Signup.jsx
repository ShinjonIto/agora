import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosPublic from "../api/axiosPublic";
import FormInput from "../components/form/FormInput";
import { validateField, validateAll } from "../utils/validation";
import { getFormStatus } from "../utils/formState";
import "./authPages.css";

const Signup = () => {
    const navigate = useNavigate();

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

        // password変更時は confirm も再チェック
        if (name === "password" && nextForm.confirm_password) {
        setErrors((prev) => ({
            ...prev,
            confirm_password: validateField(
            "confirm_password",
            nextForm.confirm_password,
            nextForm
            ),
        }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitErrors("");

        // クライアント側バリデーション
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

        // DRF からのエラーをフィールドごとに反映
        if (err.response?.data) {
            const data = err.response.data;

            // フィールドエラー
            const fieldErrors = { ...errors };
            Object.keys(fieldErrors).forEach((key) => {
            fieldErrors[key] = data[key]?.[0] || "";
            });
            setErrors(fieldErrors);

            // non_field_errors や全体エラー
            if (data.non_field_errors) {
            setSubmitErrors(data.non_field_errors.join(" "));
            } else {
            // 他の全体エラー
            const otherErrors = Object.keys(data)
                .filter((key) => !fieldErrors[key])
                .map((key) => data[key]?.[0])
                .filter(Boolean)
                .join(" ");
            setSubmitErrors(otherErrors || "登録に失敗しました");
            }
        } else {
            setSubmitErrors("登録に失敗しました");
        }
        }
    };

    return (
        <div className="authPages">
        <div className="batu">
            <Link to="/login">×</Link>
        </div>

        <form onSubmit={handleSubmit}>
            <FormInput
            name="user_name"
            value={form.user_name}
            error={errors.user_name}
            onChange={handleChange}
            />

            <FormInput
            name="student_number"
            value={form.student_number}
            error={errors.student_number}
            onChange={handleChange}
            />

            <FormInput
            name="email"
            value={form.email}
            error={errors.email}
            onChange={handleChange}
            />

            <FormInput
            name="password"
            value={form.password}
            error={errors.password}
            onChange={handleChange}
            required
            />

            <FormInput
            name="confirm_password"
            value={form.confirm_password}
            error={errors.confirm_password}
            onChange={handleChange}
            required
            />

            {submitErrors && <p className="error">{submitErrors}</p>}

            <div className="links">
            <button
                type="submit"
                className={`button ${canSubmit ? "ok_button" : "no_button"}`}
                disabled={!canSubmit}
            >
                登録
            </button>
            <Link to="/login" className="link">
                ログインはこちら
            </Link>
            </div>
        </form>
        </div>
    );
};

export default Signup;