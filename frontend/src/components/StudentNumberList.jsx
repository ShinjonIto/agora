import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosPrivate from "@/api/axiosPrivate";
import "./StudentNumberList.css";
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
        <div className="adminCard">

            <div className="adminCard__head">
                <h3 className="adminCard__title">学生番号一覧</h3>
                <p className="adminCard__desc">
                    現在利用中、停止中のユーザーが表示されます。<br />
                    （削除された学生は表示されません。）
                </p>
            </div>

            <div className="adminTableWrap">
                <table className="adminTable">
                    <thead className="adminTable__head">
                        <tr className="adminTable__row adminTable__row--head">
                            <th className="adminTable__th">学生番号</th>
                            <th className="adminTable__th">利用状況</th>
                            <th className="adminTable__th adminTable__th--action"></th>
                        </tr>
                    </thead>

                    <tbody className="adminTable__body">
                        {list.map((item) => (
                            <tr key={item.student_number} className="adminTable__row">
                                <td
                                    className={`adminTable__td adminTable__student ${item.user_id ? "isLink" : "isDisabled"}`}
                                    onClick={() => {
                                        if (item.user_id) {
                                            navigate(`/mypage/${item.user_id}`);
                                        }
                                    }}
                                >
                                    {item.student_number}
                                </td>

                                <td className="adminTable__td adminTable__status">
                                    {item.status}
                                </td>

                                <td className="adminTable__td adminTable__action">
                                    {item.user_id && (
                                        <Link
                                            to={`/managements/student_number/${item.student_number}`}
                                            className="adminActionLink"
                                        >
                                            変更
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default StudentNumberList;