import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import FormInput from "../components/form/FormInput";
import { validateField, validateAll } from "../utils/validation";
import { getFormStatus } from "../utils/formState";
import "./StudentNumberList.css";

const AdminAdd = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        student_number: "",
        user_name: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [errors, setErrors] = useState({});
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

        const nextErrors = validateAll(form);
        setErrors(nextErrors);

        if (!getFormStatus(form, nextErrors).canSubmit) {
            setSubmitErrors("入力内容を確認してください");
            return;
        }

        try {
            await axiosPrivate.post("/api/users/admin/add/", form);
            alert("管理者を追加しました");
            navigate("/managements/admin");
        } catch (err) {
            console.error(err);
            setSubmitErrors("管理者の追加に失敗しました");
        }
    };

    return (
        <div className="adminCard">
            <div className="adminCard__head">
                <h3 className="adminCard__title">管理者追加</h3>
                <p className="adminCard__desc">以下の情報を入力して、管理者を追加してください。</p>
            </div>

            <form onSubmit={handleSubmit} className="adminForm">
                {/* ここは “行” としてまとめておく（あなたのCSSに adminForm__row がある） */}
                <div className="adminForm__row">
                    <FormInput
                        name="user_name"
                        value={form.user_name}
                        error={errors.user_name}
                        className="adminInput"
                        onChange={handleChange}
                    />
                </div>

                <div className="adminForm__row">
                    <FormInput
                        name="student_number"
                        value={form.student_number}
                        error={errors.student_number}
                        className="adminInput"
                        onChange={handleChange}
                    />
                </div>

                <div className="adminForm__row">
                    <FormInput
                        name="email"
                        value={form.email}
                        error={errors.email}
                        className="adminInput"
                        onChange={handleChange}
                    />
                </div>

                <div className="adminForm__row">
                    <FormInput
                        name="password"
                        value={form.password}
                        error={errors.password}
                        onChange={handleChange}
                        className="adminInput"
                        required
                    />
                </div>

                <div className="adminForm__row">
                    <FormInput
                        name="confirm_password"
                        value={form.confirm_password}
                        error={errors.confirm_password}
                        onChange={handleChange}
                        className="adminInput"
                        required
                    />
                </div>

                {submitErrors && <p className="error">{submitErrors}</p>}

                <button className="adminButton" disabled={!canSubmit}>
                    管理者を追加
                </button>
            </form>
        </div>
    );
};

export default AdminAdd;