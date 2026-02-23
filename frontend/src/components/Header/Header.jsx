import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserProfile from "../UserProfile";
import LogoutButton from "../LogoutButton";
import axiosPrivate from "@/api/axiosPrivate";
import "./Header.css";
import HeaderOka from "@/assets/images/header/header_oka.svg?react";
import Bell from "@/assets/images/icon/bell.svg?react";
import { useFxKey } from "@/hooks/useFxKey";
import Ripple from "@/components/effects/Ripple";
import Burst from "@/components/effects/Burst";

const Header = ({ user }) => {
    const navigate = useNavigate();
    const isAuthed = !!user?.id;
    const currentUserId = user?.id;

    const [showMenu, setShowMenu] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

//   ここ確認
    const [keyword, setKeyword] = useState("");

    const logoFx = useFxKey();
    const bellFx = useFxKey();

    // ロゴクリック
    const handleLogoClick = (e) => {
        e.stopPropagation();
        logoFx.triggerFx(500);
        setTimeout(() => navigate("/"), 200);
    };

    // メニュー開閉
    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu((prev) => !prev);
    };

    // 外クリックでメニュー閉じる
    useEffect(() => {
        const closeMenu = () => setShowMenu(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);


    // 検索　ここ
    const handleSearch = (e) => {
        e.preventDefault();
        if (!keyword.trim()) return;
        navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
    };


    // 未読通知取得
    useEffect(() => {
        if (!isAuthed) return;

        const fetchUnread = async () => {
        try {
            const res = await axiosPrivate.get("/api/notifications/unread/");
            setUnreadCount(res.data.count);
        } catch (err) {
            console.error("未読取得エラー:", err);
        }
        };




        fetchUnread(); // 初回取得
        const interval = setInterval(fetchUnread, 30000); // 30秒ごと
        return () => clearInterval(interval);
    }, [isAuthed]);


    // 通知クリック
    const handleNotificationClick = (e) => {
        e.stopPropagation();
        setUnreadCount(0);
        navigate("/notifications");
    };

    return (
        <header className="HeaderRoot">
            <div className="flex">
                <div className="header-inner">
                    {/* ロゴ */}
                    <div onClick={handleLogoClick}>
                        <hgroup className="HeaderLogo fxBtn HeaderLogoFx">
                            {logoFx.showFx && (
                                <Burst fxKey={logoFx.fxKey} spread={42} size={5} />
                            )}
                            <p>MIEコミュニティサイト</p>
                            <h1 className="fx-foreground">AGORA</h1>
                        </hgroup>
                    </div>

                    {/* 通知・ユーザーメニュー */}
                    {isAuthed && (
                        <div className="flex2">
                            <button
                                className="fxBtn bellBtn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    bellFx.triggerFx(600);
                                    setTimeout(() => handleNotificationClick(e), 80);
                                }}
                                type="button"
                            >
                                {bellFx.showFx && <Ripple fxKey={bellFx.fxKey} />}
                                <Bell className="icon-s fx-foreground" />
                                {unreadCount > 0 && (
                                    <span className="bellBadge">{unreadCount}</span>
                                )}
                            </button>

                            <div className="icon-s" onClick={toggleMenu}>
                                <UserProfile user={user} />
                                {showMenu && (
                                    <div className="HeaderModal" onClick={(e) => e.stopPropagation()}>
                                        <Link
                                            to={`/mypage/${currentUserId}`}
                                            className="HeaderModalLink"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            マイページ
                                        </Link>


                                        <Link
                                            to="/theme_change"
                                            className="HeaderModalLink"
                                            onClick={() => setShowMenu(false)}
                                        >
                                            テーマ変更
                                        </Link>




                                        {/* 管理画面 */}
                                        {user?.permission === 0 && (
                                            <Link
                                                to="/managements/student_number"
                                                className="HeaderModalLink"
                                                onClick={() => setShowMenu(false)}
                                            >
                                                管理者画面
                                            </Link>
                                        )}

                                        <div className="HeaderModalLink">
                                            <LogoutButton />
                                        </div>




                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <HeaderOka className="header-oka" preserveAspectRatio="none" />
        </header>
    );
};

export default Header;