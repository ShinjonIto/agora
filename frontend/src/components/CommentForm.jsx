import axiosPrivate from "@/api/axiosPrivate";
import React, { useState, useMemo, useRef, useCallback } from "react"; 
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 

const CommentForm = ({ postId, parentCommentId = null, setComments, onSuccess }) => {
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

    // エディタの構成
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ["image", "link"],
                ['blockquote', 'code-block'],
            ],
            handlers: {
                image: imageHandler,
            },
        },
    }), [imageHandler]);

    // コメント投稿
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content || content === "<p><br></p>") return;

        try {
            setLoading(true);
            setError(null);

            const res = await axiosPrivate.post(`/api/comments/${postId}/create/`, {
                content,
                parent_comment: parentCommentId,
            });

            const newComment = res.data;

            if (!parentCommentId) {
                setComments((prev) => [...prev, newComment]);
            } 
            else {
                const addReply = (list) =>
                    list.map((c) => {
                        if (c.comment_id === parentCommentId) {
                            return {
                                ...c,
                                children: [...(c.children || []), newComment],
                            };
                        }
                        if (c.children?.length) {
                            return {
                                ...c,
                                children: addReply(c.children),
                            };
                        }
                        return c;
                    });
                setComments((prev) => addReply(prev));
            }

            setContent("");
            if (onSuccess) onSuccess();

        } catch (err) {
            console.error(err);
            setError("コメントの投稿に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="comment-form-container">
            <form onSubmit={handleSubmit}>
                <ReactQuill 
                    ref={quillRef}
                    theme="snow"
                    value={content} 
                    onChange={setContent} 
                    modules={modules}
                    placeholder="画像はドラッグ＆ドロップで好きな場所に貼れます..."
                    style={{ backgroundColor: "white", color: "black", borderRadius: "8px"}}
                />
                {error && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{error}</p>}
                <button 
                    type="submit" 
                    disabled={loading || !content || content === "<p><br></p>"}
                    style={{ marginTop: "10px" }}
                >
                    {loading ? "送信中..." : "コメントする"}
                </button>
            </form>
        </div>
    );
};

export default CommentForm;
