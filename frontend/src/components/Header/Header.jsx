import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserProfile from "../UserProfile";
import LogoutButton from "../LogoutButton";
import axiosPrivate from "@/api/axiosPrivate";
import "./Header.css";
import HeaderOka from "@/assets/images/header/header_oka.svg?react";
import Bell from "@/assets/images/icon/bell.svg?react"

// エフェクト
import { useFxKey } from "@/hooks/useFxKey";
import Ripple from "@/components/effects/Ripple";
import Burst from "@/components/effects/Burst";

const Header = ({ user }) => {
    const navigate = useNavigate();
    const isAuthed = !!user?.id;
    const currentUserId = user?.id;

    const [showMenu, setShowMenu] = useState(false);
    const [unread, setUnread] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const logoFx = useFxKey();
    const bellFx = useFxKey();
    // ロゴ
    const handleLogoClick = (e) => {
        e.stopPropagation();
        logoFx.triggerFx(500);
        setTimeout(() => navigate("/"), 80);
    };

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
        if (!isAuthed) return;
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
    }, [isAuthed]);



    // 通知クリック 移動
    const handleNotificationClick = (e) => {
        e.stopPropagation();
        // 遷移時に数字を隠す
        setUnreadCount(0);
        navigate("/notifications");
    };


    return (
        <header className="HeaderRoot">
            <div className="flex">
                <div className="header-inner">
                    <div onClick={handleLogoClick}>
                        <hgroup className="HeaderLogo fxBtn HeaderLogoFx">
                            {logoFx.showFx && (
                                <>

                                    <Burst fxKey={logoFx.fxKey} spread={42} size={5} />
                                </>
                            )}
                            <p>MIEコミュニティサイト</p>
                            <h1 className="fx-foreground">AGORA</h1>
                        </hgroup>
                    </div>



                    {/* <div onClick={handleNotificationClick}>
                        <Bell className="icon-m" />
                        通知数表示
                        {unreadCount > 0 && (
                            <span>
                                {unreadCount}
                            </span>
                        )}
                    </div> */}
                    {isAuthed ? (
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
                                {bellFx.showFx && (
                                    <>
                                        <Ripple fxKey={bellFx.fxKey} />
                                    </>
                                )}

                                <Bell className="icon-s fx-foreground" />

                                {unreadCount > 0 && (
                                    <span className="bellBadge">{unreadCount}</span>
                                )}
                            </button>

                            <div className="icon-s" onClick={toggleMenu}>
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
                    ) : (
                        <div className="flex2">
                            <Link to="#">このサイトについて</Link>
                        </div>
                    )}
                </div>
            </div>

            <HeaderOka className="header-oka" preserveAspectRatio="none" />
        </header>
    );
};

export default Header;