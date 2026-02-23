import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";
import { Link } from "react-router-dom";

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);



    const fetchAdmins = async () => {
        try {
            const res = await axiosPrivate.get("/api/users/admin/list/");
            setAdmins(res.data);
        } catch (err) {
            console.error(err);
            alert("管理者一覧の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        fetchAdmins();
    }, []);



    // 管理者削除
    const handleDelete = async (userId, studentNumber) => {
        const ok = window.confirm(
            `管理者（${studentNumber}）を削除しますか？`
        );
        if (!ok) return;

        try {
            await axiosPrivate.patch(`/api/users/admin/delete/${userId}/`);

            // 画面から即削除（再取得しなくてOK）
            setAdmins(prev =>
                prev.filter(admin => admin.id !== userId)
            );

            alert("管理者を削除しました");
        } catch (err) {
            console.error(err);
            alert("削除に失敗しました");
        }
    };

    if (loading) return <p>読み込み中...</p>;

    return (
        <div className="adminCard">

            <div className="adminCard__head">
                <h3 className="adminCard__title">管理者一覧</h3>
            </div>

            <div className="adminTableWrap">
                <table className="adminTable">
                    <thead className="adminTable__head">
                        <tr className="adminTable__row adminTable__row--head">
                            <th className="adminTable__th">学生番号</th>
                            <th className="adminTable__th adminTable__th--action">操作</th>
                        </tr>
                    </thead>

                    <tbody className="adminTable__body">
                        {admins.length > 0 ? (
                            admins.map(admin => (
                                <tr key={admin.id} className="adminTable__row">
                                    <td className="adminTable__td">
                                        {admin.student_number}
                                    </td>
                                    <td className="adminTable__td adminTable__action">
                                        <button
                                            className="adminButton adminButton--danger"
                                            onClick={() =>
                                                handleDelete(
                                                    admin.id,
                                                    admin.student_number
                                                )
                                            }
                                        >
                                            削除
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="adminTable__row">
                                <td className="adminTable__td adminEmpty" colSpan="2">
                                    管理者がいません
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="adminFoot">
                <Link to="/managements/admin/add" className="adminActionLink">
                    管理者を追加
                </Link>
            </div>
        </div>
    );
};

export default AdminList;