import React, { useState, useMemo, useCallback } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import axiosPrivate from "../api/axiosPrivate";

const PostForm = ({ onSuccess, initialData = null, isEdit = false }) => {
    // 編集時は initialData の値を初期値にセットする
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [department, setDepartment] = useState(initialData?.department || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // useCallbackで関数を固定し、エディタの再描画を防ぐ
    const uploadImage = useCallback(async (file, onSuccess, onError) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            // Django側の ImageUploadAPIView を叩く
            const res = await axiosPrivate.post("/api/posts/upload_image/", formData);
            // サーバーから返ってきたURLをエディタに挿入
            onSuccess(res.data.url);
        } catch (err) {
            console.error("Upload Error:", err);
            onError("画像のアップロードに失敗しました");
        }
    }, []);

    // useMemoの依存配列を空[]にすることで、入力中にエディタが初期化されるのを防ぐ
    const mdeOptions = useMemo(() => ({
        autofocus: false,
        spellChecker: false,
        sideBySideFullscreen: false,
        placeholder: "画像はドラッグ＆ドロップで好きな場所に貼れます...",
        uploadImage: true,
        imageUploadFunction: uploadImage,
        imageAccept: "image/png, image/jpeg, image/gif",
        status: ["lines", "words"],
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true,
        },
        // ツールバーにプレビューボタン等を表示
        toolbar: [
            "bold", "italic", "heading", "|",
            "quote", "unordered-list", "ordered-list", "|",
            "link", "image", "|",
            "side-by-side", "fullscreen", "preview", "|", "guide"
        ],
    }), [uploadImage]);

    // 公開ボタン
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError("タイトルと本文を入力してください");
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const postData = { title, content, department };
            let res;

            if (isEdit && initialData) {
                // 編集時はPUTで更新用URLへ送信
                res = await axiosPrivate.put(`/api/posts/${initialData.post_id}/update/`, postData);
            } else {
                // 新規時はPOSTで作成用URLへ送信
                res = await axiosPrivate.post("/api/posts/create/", postData);
            }

            console.log(isEdit ? "更新成功:" : "投稿成功:", res.data);

            // 成功時、新規投稿ならリセット（編集ならリセットしなくてOK）
            if (!isEdit) {
                setTitle("");
                setContent("");
                setDepartment(null);
            }

            if (onSuccess) onSuccess(res.data);


        } catch (err) {
            console.error("投稿エラーの詳細:", err.response?.data || err.message);
            // サーバーからの具体的なエラーメッセージがあれば表示
            const serverMsg = err.response?.data?.detail || "投稿に失敗しました";
            setError(serverMsg);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>記事作成</h2>

                <div>
                    <select
                        value={department ?? ""}
                        onChange={(e) => setDepartment(e.target.value === "" ? null : Number(e.target.value))}
                    >
                        <option value="">学科を選択しない</option>
                        <option value={0}>自動車整備</option>
                        <option value={1}>スポーツバイシクル</option>
                        <option value={2}>情報システム</option>
                    </select>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="タイトルを入力"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* 本文エディタ：ここに画像をドロップ！ */}
                <SimpleMDE value={content} onChange={setContent} options={mdeOptions} />

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading} >
                    {loading ? "投稿中..." : "記事を公開する"}
                </button>
            </form>
        </div>
    );
};

export default PostForm;
