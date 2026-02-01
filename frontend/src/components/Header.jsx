import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import CreatePostButton from "./CreatePostButton";
import LogoutButton from "./LogoutButton";

const Header = ({user}) => {
    const navigate = useNavigate();

    // ロゴクリックしたらホーム画面へ
    const handleLogoClick = () => {
        navigate("/")
    };

    return (
        <header>
            {/* ロゴ */}
            <div onClick={handleLogoClick}>
                <p>ここにロゴ入れる</p>
            </div>

            {/* ユーザーアイコン */}
            <UserProfile  user={user}/>

            {/* 記事作成ボタン */}
            <CreatePostButton />

            {/* ログアウトボタン */}
            <LogoutButton />

            {/* あとで検索バー追加 */}
            <p>検索バー追加</p>
        </header>
        
    )
}

export default Header