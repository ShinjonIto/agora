import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import StudentNumberAdd from "../components/StudentNumberAdd";
import StudentNumberList from "../components/StudentNumberList";
import StudentNumberDelete from "../components/StudentNumberDelete";

const AdminDashboard = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("list"); // デフォルト

    // URLに応じてタブを切り替える
    useEffect(() => {
        if (location.pathname.endsWith("/list")) {
        setActiveTab("list");
        } else if (location.pathname.endsWith("/add")) {
        setActiveTab("add");
        } else if (location.pathname.endsWith("/delete")) {
        setActiveTab("delete");
        }
    }, [location.pathname]);

    return (
        <div>
        {/* 上部タブボタン */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
            onClick={() => setActiveTab("list")}
            style={{ fontWeight: activeTab === "list" ? "bold" : "normal" }}
            >
            学生番号一覧
            </button>
            <button
            onClick={() => setActiveTab("add")}
            style={{ fontWeight: activeTab === "add" ? "bold" : "normal" }}
            >
            登録
            </button>
            <button
            onClick={() => setActiveTab("delete")}
            style={{ fontWeight: activeTab === "delete" ? "bold" : "normal" }}
            >
            削除
            </button>
        </div>

        {/* タブ切替 */}
        {activeTab === "list" && <StudentNumberList />}
        {activeTab === "add" && <StudentNumberAdd />}
        {activeTab === "delete" && <StudentNumberDelete />}
        </div>
    );
};

export default AdminDashboard;