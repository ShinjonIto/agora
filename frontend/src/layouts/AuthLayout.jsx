import { Outlet } from "react-router-dom";
import "./AuthLayout.css";
import Header from "@/components/Header/Header";

import Sakaki from "@/assets/images/account/sakaki.png";

export default function AuthLayout() {
    return (
        <div className="authShell">
            <div className="authCard">
                <Outlet />
            </div>
            <img src={Sakaki} className="sakaki" />
        </div>
    );
}