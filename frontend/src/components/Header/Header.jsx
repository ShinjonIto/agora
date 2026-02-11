import React, { useEffect, useState } from "react"; 
import { useNavigate, Link } from "react-router-dom"; 
import UserProfile from "../UserProfile";
import LogoutButton from "../LogoutButton";

import "./Header.css";

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
                <div onClick={handleLogoClick}>
                    <hgroup>
                        <p>ちょっと話そう。話題を持ち寄ろう。</p>
                        <h1>AGORA</h1>
                    </hgroup>
                </div>




                {/* あとで検索バー追加 */}
                <p>search</p>


                {/* ログアウトボタン */}
                <LogoutButton />

                {/* ユーザーアイコン：クリックでモーダル表示 */}
                <div onClick={toggleMenu} style={{ position: "relative", cursor: "pointer" }}>
                    <UserProfile user={user} />

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
                        </div>
                    )}
                </div>
            </div>




            <HeaderOka className="header-oka" />
        </header>

    )
}

export default Header