import { Outlet, useLocation } from "react-router-dom";
import "./AuthLayout.css";
import Header from "@/components/Header/Header";
import LoginHeader from "@/components/Header/LoginHeader";


import Sakaki from "@/assets/images/account/sakaki.png";

export default function AuthLayout() {
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case "/login":
                return "LOGIN";

            case "/signup":
                return "SIGNUP";

            case "/password":
                return "PASSWORD";

            default:
                return "";
        }
    }
    return (
        <div className="Authlayout">
            <LoginHeader className="loginHeader" />
            <div className="authShell">
                <h2>{getTitle()}</h2>
                <div className="authCard">
                    <Outlet />
                </div>
            </div>

            <img src={Sakaki} className="sakaki" />
        </div >

    );
}