import React, { useEffect, useState, useRef } from "react"; // useRefを追加
import axiosPrivate from "@/api/axiosPrivate";

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
                    
                    // 3秒待ってから既読にする（これで「＊」を確実に見せる）
                    setTimeout(async () => {
                        if (isMounted) {
                            await axiosPrivate.patch("/api/notifications/read/");
                        }
                    }, 3000);
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
        const names = { 0: "フォロー", 1: "投稿にいいね", 2: "コメント", 3: "コメントにいいね" };
        const action = names[n.notification_type] || "通知";
        return `${n.actor_name} さんが${action}しました`;
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
            <h2>通知</h2>
            {notifications.length === 0 && <p>通知はありません</p>}
            {notifications.map((n) => (
                <div key={n.notification_id}>
                    <p>
                        {renderText(n)}
                        {/* is_readが真(true)でなければ表示 */}
                        {!n.is_read && <span style={{ color: "red", fontWeight: "bold" }}>＊ </span>}
                    </p>
                    <small>{formatDate(n.created_at)}</small>
                </div>
            ))}

        </div>
    );
};

export default NotificationList;
