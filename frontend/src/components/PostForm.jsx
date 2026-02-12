import React, { useState, useMemo, useCallback, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 
import axiosPrivate from "../api/axiosPrivate";

const PostForm = ({ onSuccess, initialData = null, isEdit = false }) => {
    // 編集時は initialData の値を初期値にセットする
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [department, setDepartment] = useState(initialData?.department || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const quillRef = useRef(null); 

    // 画像アップロード処理
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
                const res = await axiosPrivate.post("/api/posts/upload_image/", formData);
                const url = res.data.url;
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range ? range.index : quill.getLength(), "image", url);
            } catch (err) {
                alert("画像のアップロードに失敗しました");
            }
        };
    };

    // ツールバーの設定（太字、見出し、リスト、画像など）
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ['bold', 'italic', 'underline'], // 太字など
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'], // 画像
                ['clean']
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), []);

    // 空で投稿できないように
    const isQuillEmpty = (html) => {
        const text = html
            .replace(/<(.|\n)*?>/g, "") // HTMLタグ除去
            .replace(/&nbsp;/g, "")     // nbsp除去
            .trim();                    // 空白削除
        return text.length === 0;
    };



    // 公開ボタン
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || isQuillEmpty(content)) {
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

                {/* 本文 */}
                <div style={{ backgroundColor: "white", color: "black" }}>
                    <ReactQuill 
                        ref={quillRef}
                        theme="snow"
                        value={content} 
                        onChange={setContent} 
                        modules={modules}
                        placeholder="本文を入力してください..."
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={loading} >
                    {loading ? "投稿中..." : "記事を公開する"}
                </button>
            </form>
        </div>
    );  
};

export default PostForm;
