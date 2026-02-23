import React, { useEffect, useState, useRef } from "react"; // useRefを追加
import axiosPrivate from "@/api/axiosPrivate";
import "./NotificationList.css"
const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const isReadCalled = useRef(false); // 既読APIを1回だけ呼ぶためのフラグ


    useEffect(() => {
        let isMounted = true;

        const initNotifications = async () => {
            try {
                // 先にデータを取得して表示を確定させる
                const res = await axiosPrivate.get("/api/notifications/list/");
                if (isMounted) {
                    setNotifications(res.data);

                    // 既読にする
                    setTimeout(async () => {
                        if (isMounted) {
                            await axiosPrivate.patch("/api/notifications/read/");
                        }
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initNotifications();
        return () => { isMounted = false; };
    }, []);




    // 通知内容
    const renderText = (n) => {
        switch (n.notification_type) {
            case 0: // フォロー
                return `${n.actor_name} さんがあなたをフォローしました。`;
            case 1: // 投稿にいいね
                return `${n.actor_name} さんがあなたの記事にいいねしました。`;
            case 2: // コメント
                return `${n.actor_name} さんがあなたの記事にコメントしました。`;
            case 3: // コメントにいいね
                return `${n.actor_name} さんがあなたのコメントにいいねしました。`;
            default:
                return "通知があります";
        }
    };

    // 日付
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const postDate = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "今日 " + postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return "昨日";
        return postDate.toLocaleDateString();
    };



    if (loading) return <p>loading...</p>;

    return (
        <div className="notification-container">
            <h2 className="notification-title">通知</h2>

            {notifications.length === 0 && (
                <p className="notification-empty">通知はありません</p>
            )}

            {notifications.map((n) => (
                <div
                    key={n.notification_id}
                    className={`notification-item ${n.is_read ? "read" : "unread"}`}
                >
                    <p className="notification-text">
                        {renderText(n)}

                        {!n.is_read && (
                            <span className="notification-unread">＊ </span>
                        )}
                    </p>

                    <small className="notification-date">
                        {formatDate(n.created_at)}
                    </small>
                </div>
            ))}
        </div>
    );
};

export default NotificationList;
