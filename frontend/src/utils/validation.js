// src/utils/validation.js
export const FIELD_CONFIG = {
    user_name: {
        title: "ユーザー名",
        placeholder: "松本花子",
        type: "text",
        autoComplete: "username",
    },
    student_number: {
        title: "学生番号",
        placeholder: "123456789",
        type: "text",
        inputMode: "numeric",
        autoComplete: "off",
    },
    email: {
        title: "メールアドレス",
        placeholder: "hanako.matsumoto@example.com",
        type: "email",
        autoComplete: "email",
    },
    password: {
        title: "パスワード",
        placeholder: "abc123",
        type: "password",
        autoComplete: "new-password",
    },
    confirm_password: {
        title: "パスワード再入力",
        placeholder: "もう一度入力してください",
        type: "password",
        autoComplete: "new-password",
    },
};

export const validateField = (name, value, form) => {
    const v = String(value ?? "");

    switch (name) {
        case "user_name":
            return v.trim() ? "" : "ユーザー名を入力してください";

        case "student_number":
            return /^\d{9,}$/.test(v) ? "" : "学生番号は数字8文字以上です";

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
