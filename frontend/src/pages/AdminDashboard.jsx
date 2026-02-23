import { NavLink, Outlet } from "react-router-dom";
import "./AdminDashboard.css"
const AdminDashboard = () => {
    return (
        <div className="admin">
            {/* タブ */}
            <nav className="admin-tabs">

                <NavLink
                    to="/managements/student_number"
                    end
                    className={({ isActive }) =>
                        `admin-tab ${isActive ? "active" : ""}`
                    }
                >
                    学生一覧
                </NavLink>

                <NavLink
                    to="/managements/student_number/add"
                    className={({ isActive }) =>
                        `admin-tab ${isActive ? "active" : ""}`
                    }
                >
                    学生登録
                </NavLink>

                <NavLink
                    to="/managements/student_number/delete"
                    className={({ isActive }) =>
                        `admin-tab ${isActive ? "active" : ""}`
                    }
                >
                    卒業生削除
                </NavLink>

                <NavLink
                    to="/managements/admin"
                    className={({ isActive }) =>
                        `admin-tab ${isActive ? "active" : ""}`
                    }
                >
                    管理者一覧
                </NavLink>

            </nav>

            {/* 子ルート */}
            <div className="admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;