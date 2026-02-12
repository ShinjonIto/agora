import React, { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const ReportModal = ({ type, targetId, onClose, onSuccess }) => {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    // タイトル表示用
    const title = type === "post" ? "投稿を通報" : type === "comment" ? "コメントを通報" : "ユーザーを通報";

    const handleSubmit = async () => {
        if (!reason.trim()) return alert("理由を入力してください");
        
        try {
            setLoading(true);
            // typeによってURLを切り替え
            const url = `/api/reports/${type}s/${targetId}/`;
            await axiosPrivate.post(url, { reason });
            
            alert("通報を送信しました。");
            onSuccess(targetId); // 親側で「通報済み」の状態を更新するため
            onClose();
        } catch (err) {
            console.error(err);
            alert("通報に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10000,
            display: "flex", justifyContent: "center", alignItems: "center"
        }} onClick={onClose}>
            <div style={{ backgroundColor: "white", padding: "20px", width: "90%", maxWidth: "400px", color: "black" }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ marginTop: 0 }}>{title}</h3>
                <textarea
                    style={{ width: "100%", height: "100px", margin: "10px 0", padding: "10px" }}
                    placeholder="不適切な内容、スパムなど..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button onClick={onClose}>キャンセル</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? "送信中..." : "送信する"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;
