// src/utils/validation.js
export const validateField = (name, value, form) => {
    const v = String(value ?? "");

    switch (name) {
        case "user_name":
            return v.trim() ? "" : "ユーザー名を入力してください";

        case "student_number":
            return /^\d{9,}$/.test(v) ? "" : "学生番号は数字9文字以上です";

        case "email":
            return /^\S+@\S+\.\S+$/.test(v)
                ? ""
                : "有効なメールアドレスを入力してください";

        case "password":
            return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v)
                ? ""
                : "パスワードは英数字6文字以上で入力してください";

        case "confirm_password":
            return v === String(form.password ?? "") ? "" : "パスワードが一致しません";

        default:
            return "";
    }
};

export const validateAll = (form) => {
    const nextErrors = {};
    for (const key of Object.keys(form)) {
        nextErrors[key] = validateField(key, form[key], form);
    }
    return nextErrors;
};
