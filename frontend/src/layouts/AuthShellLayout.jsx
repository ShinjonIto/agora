// src/layouts/AuthShellLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header/Header";
import "./AuthLayout.css";

const titleMap = {
    "/login": "LOGIN",
    "/signup": "SIGNUP",
    "/password": "PASSWORD",
};

export default function AuthShellLayout({ headerUser = null, title = "" }) {
    const location = useLocation();
    const computedTitle = title || titleMap[location.pathname] || "";

    return (
        <div className="Authlayout">
            <div className="header">
                <Header user={headerUser} />
            </div>

            <div className="authShell">
                {computedTitle && <h2>{computedTitle}</h2>}
                <div className="authCard">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}