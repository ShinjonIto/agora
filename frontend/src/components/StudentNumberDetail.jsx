import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import "./StudentNumberList.css";
import "./StudentNumberList.css";

const StudentNumberDetail = () => {
    const { studentNumber } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);  // 保存ボタン用
    const [loadingStatus, setLoadingStatus] = useState(true);  // GET完了フラグ




    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axiosPrivate.get(
                    `/api/users/student_number/${studentNumber}/`
                );
                // サーバーのステータスをそのまま初期値にセット
                setStatus(res.data.status || "利用中");
            } catch (err) {
                console.error(err);
                alert("学生番号の情報取得に失敗しました");
            } finally {
                setLoadingStatus(false); // GET完了
            }
        };
        fetchStatus();
    }, [studentNumber]);

    const handleSave = async () => {
        setLoading(true);

        try {
            await axiosPrivate.patch(
                `/api/users/student_number/detail/${studentNumber}/`,
                { status }
            );
            alert("保存しました");
            navigate("/managements/student_number");
        } catch (err) {
            console.error(err);
            alert("保存に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="adminCard">

            <div className="adminCard__head">
                <h3 className="adminCard__title">学生番号編集</h3>
                <p className="adminCard__desc">
                    学生番号：{studentNumber}
                </p>
            </div>

            <div className="adminForm">

                <div className="adminForm__row">
                    <select
                        className="adminSelect"
                        value={status || ""}
                        onChange={e => setStatus(e.target.value)}
                        disabled={loadingStatus}
                    >
                        <option value="利用中">利用中</option>
                        <option value="停止中">停止中</option>
                    </select>
                </div>

                <button
                    className="adminButton"
                    onClick={handleSave}
                    disabled={loading || loadingStatus}
                >
                    {loading ? "保存中..." : "保存"}
                </button>

            </div>
        </div>
    );
};

export default StudentNumberDetail;