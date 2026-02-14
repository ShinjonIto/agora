import axiosPrivate from "@/api/axiosPrivate";
import React, { useState, useMemo, useRef, useCallback } from "react"; 
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 
import { useCommentQuillModules, commentFormats } from "@/utils/commentQuillConfig";

const CommentForm = ({ postId, parentCommentId = null, replyTargetName = null, setComments, onSuccess }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    const quillRef = useRef(null);


    // 画像アップロード
    const imageHandler = useCallback(() => {
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

                if (quillRef.current) {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    quill.insertEmbed(range ? range.index : quill.getLength(), "image", url);
                }
            } catch (err) {
                console.error("Upload error:", err);
                alert("画像のアップロードに失敗しました");
            }
        };
    }, []);

    const modules = useCommentQuillModules(imageHandler);  // フォーム


    // 空で投稿できないように
    const isQuillEmpty = (html) => {
        const text = html
            .replace(/<(.|\n)*?>/g, "") // HTMLタグ除去
            .replace(/&nbsp;/g, "")     // nbsp除去
            .trim();                    // 空白削除
        return text.length === 0;
    };


    // コメント投稿
    // コメント投稿
    const handleSubmit = async (e) => {
        e.preventDefault(); // フォームのデフォルト動作を阻止

        if (isQuillEmpty(content)) {
            setError("コメントを入力してください");
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            const res = await axiosPrivate.post(`/api/comments/${postId}/create/`, {
                content,
                parent_comment: parentCommentId,
            });

            const newComment = {...res.data, children: []};

            // ステートを更新
            if (!parentCommentId) {
                setComments(prev => [...prev, newComment]);
            } else {
                setComments((prev) => {
                    const addReply = (list) =>
                        list.map((c) => {
                            if (String(c.comment_id) === String(parentCommentId)) {
                                return {
                                    ...c,
                                    children: [...(c.children || []), newComment],
                                };
                            }
                            if (c.children && c.children.length > 0) {
                                return {
                                    ...c,
                                    children: addReply(c.children),
                                };
                            }
                            return c;
                        });
                    return addReply(prev);
                });
            }

            setContent(""); 
            if (onSuccess) onSuccess(); 

        } catch (err) {
            console.error("投稿エラー:", err);
            setError("コメントの投稿に失敗しました");
        } finally {
            setLoading(false); // 成功しても失敗しても、ここで送信中を解除
        }
    };



    return (
        <div className="comment-form-container">
            {/* 返信の時だけ宛先を表示 */}
            {parentCommentId && replyTargetName && (
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                    <strong>@{replyTargetName}</strong> さんへの返信
                </p>
            )}
            
            <form onSubmit={handleSubmit}>
                <ReactQuill 
                    ref={quillRef}
                    theme="snow"
                    value={content} 
                    onChange={setContent} 
                    modules={modules}
                    formats={commentFormats}
                    placeholder="コメントを入力..."
                    style={{ backgroundColor: "white", color: "black", borderRadius: "8px"}}
                />
                {error && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ marginTop: "10px" }}
                >
                    {loading ? "送信中..." : parentCommentId ? "返信する" : "コメントする"}
                </button>
            </form>
        </div>
    );
};

export default CommentForm;
