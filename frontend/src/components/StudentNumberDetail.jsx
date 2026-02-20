import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";

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
        <div>
            <h3>学生番号編集</h3>
            <p>学生番号：{studentNumber}</p>

            <select
                value={status || ""} 
                onChange={e => setStatus(e.target.value)}
                disabled={loadingStatus}  // GET が終わるまでだけ disable
            >
                <option value="利用中">利用中</option>
                <option value="停止中">停止中</option>
            </select>

            <br />
            <button onClick={handleSave} disabled={loading || loadingStatus}>
                保存
            </button>
        </div>
    );
};

export default StudentNumberDetail;