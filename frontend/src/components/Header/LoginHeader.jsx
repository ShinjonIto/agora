import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserProfile from "../UserProfile";
import LogoutButton from "../LogoutButton";

import "./LoginHeader.css";

import HeaderOka from "@/assets/images/header/header_oka.svg?react";




const Header = ({ user }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false); // モーダルの開閉状態

    // ユーザーID
    const currentUserId = localStorage.getItem("userId");

    // ロゴクリックしたらホーム画面へ
    const handleLogoClick = () => {
        navigate("/")
    };


    // メニュー表示切替
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    // 外側クリックしたらモーダルを閉じる
    useEffect(() => {
        const closeMenu = () => setShowMenu(false);
        window.addEventListener("click", closeMenu);
    }, []);


    return (
        <header>
            {/* ロゴ */}
            <div className="flex">
                <div >
                    <hgroup>
                        <p>ちょっと話そう。話題を持ち寄ろう。</p>
                        <h1>AGORA</h1>
                    </hgroup>
                </div>

                <Link to="/about">このサイトについて</Link>





            </div>




            <HeaderOka className="header-oka" preserveAspectRatio="none" />
        </header>

    )
}

export default Header