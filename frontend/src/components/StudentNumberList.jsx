import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const StudentNumberList = () => {
    const [studentNumbers, setStudentNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStudentNumbers = async () => {
        setLoading(true);
        try {
        const res = await axiosPrivate.get("/api/users/student_number/list/");
        setStudentNumbers(res.data || []); 
        } catch (err) {
        console.error(err);
        setError("学生番号の取得に失敗しました");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchStudentNumbers();
    }, []);

    if (loading) return <p>読み込み中...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
        <h3>学生番号一覧</h3>

        {studentNumbers.length === 0 ? (
            <p>登録されている学生番号はありません</p>
        ) : (
            <ul>
            {studentNumbers.map((stu) => (
                <li key={stu.management_id}>
                {stu.student_number}
                </li>
            ))}
            </ul>
        )}
    </div>
    );
};

export default StudentNumberList;