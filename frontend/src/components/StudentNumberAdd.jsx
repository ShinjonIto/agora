import { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const StudentNumberAdd = () => {
    const [startNumber, setStartNumber] = useState("");
    const [endNumber, setEndNumber] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!window.confirm("この範囲の学生番号を登録しますか？")) return;

        setLoading(true);
        setResult(null);

        try {
        const res = await axiosPrivate.post("/api/users/student_number/add/", {
            start_number: Number(startNumber),
            end_number: Number(endNumber),
        });

        setResult(res.data);
        setStartNumber("");
        setEndNumber("");
        } catch (err) {
        console.error(err);
        alert("登録に失敗しました");
        }

        setLoading(false);
    };

    return (
        <div>
        <h3>学生番号登録</h3>

        <p>登録してもいい学生番号の範囲を入力してください。<br />
            登録された範囲の学生は会員登録・ログインができるようになります。</p>

        <form onSubmit={handleSubmit}>
            <input
            type="number"
            placeholder="開始番号"
            value={startNumber}
            onChange={(e) => setStartNumber(e.target.value)}
            required
            />
            <input
            type="number"
            placeholder="終了番号"
            value={endNumber}
            onChange={(e) => setEndNumber(e.target.value)}
            required
            />
            <button disabled={loading}>登録</button>
        </form>

        {result && (
            <div style={{ marginTop: "16px" }}>
            {result.created.length > 0 && (
                <div>
                <h4>新規登録</h4>
                <ul>
                    {result.created.map((n) => (
                    <li key={n}>{n}</li>
                    ))}
                </ul>
                </div>
            )}

            {result.restored.length > 0 && (
                <div>
                <h4>復活</h4>
                <ul>
                    {result.restored.map((n) => (
                    <li key={n}>{n}</li>
                    ))}
                </ul>
                </div>
            )}

            {result.already_exists.length > 0 && (
                <div>
                <h4>既に存在</h4>
                <ul>
                    {result.already_exists.map((n) => (
                    <li key={n}>{n}</li>
                    ))}
                </ul>
                </div>
            )}
            </div>
        )}
        </div>
    );
};

export default StudentNumberAdd;