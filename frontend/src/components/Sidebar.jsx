import { NavLink } from "react-router-dom";
import Home from "@/assets/images/icon/home.svg?react";
import Zyouhou from "@/assets/images/icon/zyouhou.svg?react";
import Car from "@/assets/images/icon/car.svg?react";
import Bike from "@/assets/images/icon/bike.svg?react";
import "./Sidebar.css";
import { useEffect, useState } from "react";
import axiosPrivate from "@/api/axiosPrivate";

const Sidebar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
    const fetchUser = async () => {
        try {
            const res = await axiosPrivate.get("/api/users/me/");
            setUser(res.data);
        } catch (err) {
            console.error(err);
        }
        };
        fetchUser();
    }, []);




    return (
        <aside className="sidebar">
            <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    `aside_button ${isActive ? "active" : ""}`
                }
            >
                <Home className="aside_icon" />
                <span>ホーム</span>
            </NavLink>

            <NavLink
                to="/department/mch"
                className={({ isActive }) =>
                    `aside_button ${isActive ? "active" : ""}`
                }
            >
                <Car className="aside_icon" />
                <span>自動車整備学科</span>
            </NavLink>

            <NavLink
                to="/department/cyc"
                className={({ isActive }) =>
                    `aside_button ${isActive ? "active" : ""}`
                }
            >
                <Bike className="aside_icon" />
                <span>スポーツバイシクル学科</span>
            </NavLink>

            <NavLink
                to="/department/sys"
                className={({ isActive }) =>
                    `aside_button ${isActive ? "active" : ""}`
                }
            >
                <Zyouhou className="aside_icon" />
                <span>情報システム学科</span>
            </NavLink>


            {/* 管理画面 */}
            {user?.permission === 0 && (
                <NavLink
                    to="/managements/student_number"
                    className={({ isActive }) =>
                    `aside_button ${isActive ? "active" : ""}`
                    }
                >
                    <span>管理者画面</span>
                </NavLink>
                )}
        </aside>
    );
};

export default Sidebar;
