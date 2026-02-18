import { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const StudentNumberDelete = () => {
    const [startNumber, setStartNumber] = useState("");
    const [endNumber, setEndNumber] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!startNumber || !endNumber) {
        alert("開始番号と終了番号を入力してください");
        return;
        }

        setLoading(true);
        setResult(null);

        try {
        const res = await axiosPrivate.patch("/api/users/student_number/delete/", {
            start_number: Number(startNumber),
            end_number: Number(endNumber),
        });

        setResult(res.data);
        } catch (err) {
        console.error(err);
        alert(
            err.response?.data?.detail || "削除に失敗しました。範囲や権限を確認してください"
        );
        } finally {
        setLoading(false);
        }
    };

    return (
        <div>
        <h3>学生番号一括削除</h3>

        <div style={{ marginBottom: "10px" }}>
            <label>
            開始番号:{" "}
            <input
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
            />
            </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
            <label>
            終了番号:{" "}
            <input
                type="number"
                value={endNumber}
                onChange={(e) => setEndNumber(e.target.value)}
            />
            </label>
        </div>

        <button onClick={handleDelete} disabled={loading}>
            {loading ? "削除中..." : "削除"}
        </button>

        {result && (
        <div style={{ marginTop: "20px" }}>
            <p>今回削除した件数: {result.deleted.length}</p>
            {result.deleted.length > 0 && (
                <ul>
                    <p>削除した学生番号:</p>
                    {result.deleted.map((num) => (
                        <li key={num}>{num}</li>
                    ))}
                </ul>
            )}

            {result.skipped.length > 0 && (
                <ul>
                    <p>すでに削除済みの学生番号:</p>
                    {result.skipped.map((num) => (
                        <li key={num}>{num}</li>
                    ))}
                    </ul>
            )}
            </div>
        )}
        </div>
    );
};

export default StudentNumberDelete;