import { NavLink, Outlet } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div>
        {/* タブ（＝リンク） */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <NavLink
            to="/managements/student_number"
            end
            style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
            })}
            >
            学生一覧
            </NavLink>

            <NavLink
            to="/managements/student_number/add"
            style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
            })}
            >
            学生登録
            </NavLink>

            <NavLink
            to="/managements/student_number/delete"
            style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
            })}
            >
            卒業生削除
            </NavLink>

            <NavLink
            to="/managements/admin"
            style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
            })}
            >
            管理者一覧
            </NavLink>
        </div>

        {/* ここに子ルートが表示される */}
        <Outlet />
        </div>
    );
};

export default AdminDashboard;