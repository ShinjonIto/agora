import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../UserProfile";
import CreatePostButton from "../CreatePostButton";
import "./Header.css";

import HeaderOka from "../../assets/images/header/header_oka.svg?react";




const Header = ({ user }) => {
    const navigate = useNavigate();

    // ロゴクリックしたらホーム画面へ
    const handleLogoClick = () => {
        navigate("/")
    };

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

                {/* 記事作成ボタン */}
                <CreatePostButton />

                {/* ログアウトボタン */}
                {/* <LogoutButton /> */}

                {/* ユーザーアイコン */}
                <UserProfile user={user} />
            </div>




            <HeaderOka className="header-oka" />
        </header>

    )
}

export default Header