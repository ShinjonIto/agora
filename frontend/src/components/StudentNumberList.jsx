import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";

const StudentNumberList = () => {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await axiosPrivate.get("/api/users/student_number/list/");
                setList(res.data);
            } catch (err) {
                console.error(err);
                alert("学生番号一覧の取得に失敗しました");
            }
        };
        fetchList();
    }, []);



    return (
        <div>
        <h3>学生番号一覧</h3>
        <p>現在利用中、停止中のユーザーが表示されます。<br />
        （削除された学生は表示されません。）</p>

        <table>
            <thead>
            <tr>
                <th>学生番号</th>
                <th>利用状況</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {list.map(item => (
                <tr key={item.student_number}>
                    {/* 学生番号をクリックするとマイページへ（user_id がある場合のみ） */}
                    <td
                        style={{
                            cursor: item.user_id ? "pointer" : "default",       // user_id がない場合はクリック不可
                            color: item.user_id ? "blue" : "black",             // 未登録は青にしない
                            textDecoration: item.user_id ? "underline" : "none" // 未登録は下線なし
                        }}
                        onClick={() => {
                            if (item.user_id) {
                                navigate(`/mypage/${item.user_id}`);
                            }
                        }}
                    >
                        {item.student_number}
                    </td>

                    {/* 利用状況 */}
                    <td>{item.status}</td>

                    {/* 未登録の学生は「変更」を表示しない */}
                    <td>
                        {item.user_id && (                                    // user_id がある場合のみリンク表示
                            <Link to={`/managements/student_number/${item.student_number}`}>
                                変更
                            </Link>
                        )}
                    </td>
                    </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default StudentNumberList;