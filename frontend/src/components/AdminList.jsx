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
        <div>
            <h3>管理者一覧</h3>

            <table>
                <thead>
                    <tr>
                        <th>学生番号</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.length > 0 ? (
                        admins.map(admin => (
                            <tr key={admin.id}>
                                <td>{admin.student_number}</td>
                                <td>
                                    <button
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
                        <tr>
                            <td colSpan="2">管理者がいません</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Link to="/managements/admin/add">管理者を追加</Link>
        </div>
    );
};

export default AdminList;