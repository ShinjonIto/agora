import { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const StudentNumberDelete = () => {
    const [startNumber, setStartNumber] = useState("");
    const [endNumber, setEndNumber] = useState("");
    const [message, setMessage] = useState("");
    const [deletedNumbers, setDeletedNumbers] = useState([]); // 削除した番号リスト
    const [loading, setLoading] = useState(false);

    const handleDelete = async (e) => {
        e.preventDefault();
        setMessage("");
        setDeletedNumbers([]);
        setLoading(true);

        try {
        const res = await axiosPrivate.post(
            "/api/users/student_number/delete/",
            {
            start_number: Number(startNumber),
            end_number: Number(endNumber),
            }
        );

        const count = res.data.deleted_count || 0;

        // 削除番号リスト生成（Addと同じ）
        const numbers = [];
        for (let i = Number(startNumber); i <= Number(endNumber); i++) {
            numbers.push(i);
        }

        setMessage(`${count} 件の学生番号を削除しました`);
        setDeletedNumbers(numbers);
        setStartNumber("");
        setEndNumber("");
        } catch (err) {
        console.error(err);
        setMessage(
            err.response?.data?.non_field_errors?.[0] || "削除に失敗しました"
        );
        }

        setLoading(false);
    };

    return (
        <div>
        <h3>学生番号削除</h3>

        <form onSubmit={handleDelete}>
            <div>
            <label>開始番号：</label>
            <input
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
                required
            />
            </div>

            <div>
            <label>終了番号：</label>
            <input
                type="number"
                value={endNumber}
                onChange={(e) => setEndNumber(e.target.value)}
                required
            />
            </div>

            <button type="submit" disabled={loading}>
            削除
            </button>
        </form>

        {/* 結果 */}
        {message && <p>{message}</p>}

        {/* 削除した番号リスト */}
        {deletedNumbers.length > 0 && (
            <div>
            <h4>削除した番号:</h4>
            <ul>
                {deletedNumbers.map((num) => (
                <li key={num}>{num}</li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
};

export default StudentNumberDelete;