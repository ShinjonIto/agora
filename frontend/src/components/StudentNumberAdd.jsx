import { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const StudentNumberAdd = () => {
    const [startNumber, setStartNumber] = useState("");
    const [endNumber, setEndNumber] = useState("");
    const [message, setMessage] = useState("");
    const [addedNumbers, setAddedNumbers] = useState([]); // 登録した番号リスト

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setAddedNumbers([]);

        try {
        const res = await axiosPrivate.post("/api/users/student_number/add/", {
            start_number: Number(startNumber),
            end_number: Number(endNumber),
        });

        const count = res.data.created_count || 0;

        // 登録番号リストを生成
        const numbers = [];
        for (let i = Number(startNumber); i <= Number(endNumber); i++) {
            numbers.push(i);
        }

        setMessage(`${count} 件の学生番号を登録しました`);
        setAddedNumbers(numbers);
        setStartNumber("");
        setEndNumber("");
        } catch (err) {
        console.error(err);
        setMessage(
            err.response?.data?.non_field_errors?.[0] || "エラーが発生しました"
        );
        }
    };

    return (
        <div>
        <h3>学生番号登録</h3>
        <form onSubmit={handleSubmit}>
            <div>
            <label>開始番号:</label>
            <input
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
                required
            />
            </div>
            <div>
            <label>終了番号:</label>
            <input
                type="number"
                value={endNumber}
                onChange={(e) => setEndNumber(e.target.value)}
                required
            />
            </div>
            <button type="submit">登録</button>
        </form>

        {/* 結果 */}
        {message && <p>{message}</p>}

        {/* 追加した番号リスト */}
        {addedNumbers.length > 0 && (
            <div>
            <h4>追加した番号:</h4>
            <ul>
                {addedNumbers.map((num) => (
                <li key={num}>{num}</li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
};

export default StudentNumberAdd;

