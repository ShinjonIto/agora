import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserProfile from "../UserProfile";
import LogoutButton from "../LogoutButton";
import axiosPrivate from "@/api/axiosPrivate";
import { useAuth } from "@/contexts/AuthContext";

import "./Header.css";

import HeaderOka from "@/assets/images/header/header_oka.svg?react";




const Header = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false); // モーダルの開閉状態
    const { user, loading } = useAuth();

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

    if (loading) return null;
    if (!user) return null;


    return (
        <header>
            {/* ロゴ */}
            <div className="flex">
                <div onClick={handleLogoClick}>
                    <hgroup>
                        <p>MIEコミュニティサイト</p>
                        <h1>AGORA</h1>
                    </hgroup>
                </div>




                {/* あとで検索バー追加 */}
                <p>search</p>


                {/* ログアウトボタン */}


                {/* ユーザーアイコン：クリックでモーダル表示 */}
                <div className="icon" onClick={toggleMenu} >
                    <UserProfile user={user} onClick={toggleMenu} />

                    {/* アイコン押した時のモーダル */}
                    {showMenu && (
                        <div className="HeaderModal" onClick={(e) => e.stopPropagation()}>
                            <Link
                                to={`/mypage/${currentUserId}`}
                                className="HeaderModalLink"
                                onClick={() => setShowMenu(false)}
                            >
                                マイページ
                            </Link>
                            <LogoutButton />
                            <Link >このサイトについて</Link>
                        </div>
                    )}
                </div>
            </div>




            <HeaderOka className="header-oka" preserveAspectRatio="none" />
        </header>

    )
}

export default Header