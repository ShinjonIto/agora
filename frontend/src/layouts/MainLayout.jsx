import React, { useState, useEffect } from "react";
import axiosPrivate from "../api/axiosPrivate";
import Header from "../components/Header/Header";
import CreatePostButton from "../components/CreatePostButton";
import "./MainLayout.css"


const MainLayout = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const response = await axiosPrivate.get("/api/users/me/");
                setUser(response.data);
            } catch (err) {
                console.error(err);
                setError("ユーザー情報の取得に失敗しました");
            }
        };

        fetchMe();
    }, []);

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div className="layout">
            <div className="header">
                <Header user={user} />
            </div>


            {/* 各ページの中身 */}
            <main className="main">
                {children}
            </main>
            <CreatePostButton />
        </div>
    )
}

export default MainLayout