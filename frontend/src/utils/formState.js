export const getFormStatus = (form, errors) => {
    const allFilled = Object.values(form).every((v) => String(v ?? "").trim() !== "");
    const noFieldErrors = Object.values(errors).every((m) => m === "");

    const canSubmit = allFilled && noFieldErrors;

    let message = "";
    if (!allFilled) message = "すべての項目を入力してください";
    else if (!noFieldErrors) message = "入力内容を確認してください";

    return { allFilled, noFieldErrors, canSubmit, message };
};
