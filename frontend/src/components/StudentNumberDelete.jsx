import { useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import "./StudentNumberList.css";

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
        <div className="adminCard">
            <div className="adminCard__head">
                <h3 className="adminCard__title">学生番号一括削除</h3>

                <p className="adminCard__desc">
                    削除したい学生番号の範囲を入力してください。<br />
                    登録された範囲の学生は会員登録・ログインができなくなります。
                </p>
            </div>

            <div className="adminForm">
                <div className="adminflex">
                    <div className="adminField">
                        <div className="adiminFlex">
                            <label className="adminLabel">
                                <input
                                    placeholder="開始番号"
                                    className="adminInput"
                                    type="number"
                                    value={startNumber}
                                    onChange={(e) => setStartNumber(e.target.value)}
                                />
                            </label>
                            <label className="adminLabel">

                                <input
                                    className="adminInput"
                                    placeholder="終了番号"
                                    type="number"
                                    value={endNumber}
                                    onChange={(e) => setEndNumber(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>


                </div>

                <button
                    className="adminButton adminButton--danger"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? "削除中..." : "削除"}
                </button>
            </div>

            {result && (
                <div className="adminResult">
                    <p className="adminResult__summary">
                        今回削除した件数: {result.deleted.length}
                    </p>

                    {result.deleted.length > 0 && (
                        <div className="adminResult__section">
                            <p className="adminResult__label">削除した学生番号:</p>
                            <ul className="adminResult__list">
                                {result.deleted.map((num) => (
                                    <li key={num}>{num}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.skipped.length > 0 && (
                        <div className="adminResult__section">
                            <p className="adminResult__label">すでに削除済みの学生番号:</p>
                            <ul className="adminResult__list">
                                {result.skipped.map((num) => (
                                    <li key={num}>{num}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentNumberDelete;