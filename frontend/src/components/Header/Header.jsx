import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserProfile from "../UserProfile";
import LogoutButton from "../LogoutButton";
import axiosPrivate from "@/api/axiosPrivate";

import "./Header.css";
import HeaderOka from "@/assets/images/header/header_oka.svg?react";

const Header = ({ user }) => {
    const navigate = useNavigate();
    const currentUserId = user.id;

    const [showMenu, setShowMenu] = useState(false);
    const [unread, setUnread] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0); 

    // ロゴ
    const handleLogoClick = () => navigate("/");

    // メニュー開閉
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(prev => !prev);
    };

    // 外クリックで閉じる
    useEffect(() => {
        const closeMenu = () => setShowMenu(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);




    // 未読通知
    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await axiosPrivate.get("/api/notifications/unread/");
                setUnreadCount(res.data.count);
            } catch (err) {
                console.error("未読取得エラー:", err);
            }
        };
        fetchUnread(); // 初回読み込み時

        // 5秒ごとに通知があるか確認
        const interval = setInterval(fetchUnread, 5000);
        // ページを離れたらタイマーを止める
        return () => clearInterval(interval);
    }, []);



    // 通知クリック 移動
    const handleNotificationClick = (e) => {
        e.stopPropagation();
        // 遷移時に数字を隠す
        setUnreadCount(0);
        navigate("/notifications");
    };


    return (
        <header>
            <div className="flex">
                <div onClick={handleLogoClick}>
                    <hgroup>
                        <p>ちょっと話そう。話題を持ち寄ろう。</p>
                        <h1>AGORA</h1>
                    </hgroup>
                </div>

                <p>search</p>

                <div onClick={handleNotificationClick}>
                    通知
                    {/* 通知数表示 */}
                    {unreadCount > 0 && (
                        <span>
                            {unreadCount}
                        </span>
                    )}
                </div>

                <div className="icon" onClick={toggleMenu}>
                    <UserProfile user={user} />

                    {showMenu && (
                        <div
                            className="HeaderModal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Link
                                to={`/mypage/${currentUserId}`}
                                className="HeaderModalLink"
                                onClick={() => setShowMenu(false)}
                            >
                                マイページ
                            </Link>
                            <LogoutButton />
                            <Link>このサイトについて</Link>
                        </div>
                    )}
                </div>
            </div>

            <HeaderOka className="header-oka" preserveAspectRatio="none" />
        </header>
    );
};

export default Header;