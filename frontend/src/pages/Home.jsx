import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import "./Home.css";

import Flower from "@/assets/images/deco/flower.svg?react";
import Search from "@/assets/images/icon/search.svg?react";

const Home = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");

    // 検索
    const handleSearch = (e) => {
        e.preventDefault();
        const q = keyword.trim();
        if (!q) return;
        navigate(`/search?keyword=${encodeURIComponent(q)}`);
    };

    return (
        <MainLayout>
            <div className="homeLayout">
                <Sidebar className="sidebar" />

                <div className="main_contents">
                    {/* 検索フォーム */}
                    <div className="home_title">
                        <form className="header-search" onSubmit={handleSearch}>
                            <div className="searchBox">
                                <Search className="searchIcon" />

                                <input
                                    type="text"
                                    placeholder="AGORAで検索"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />

                                <button type="submit" className="searchBtn">
                                    検索
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="PostListBody">
                        <div className="homeMenu"></div>
                        <div className="postListScroll">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

            <div className="deco">
                <div className="deco_child deco_child1" />
                <div className="deco_child deco_child2" />
                <div className="deco_child deco_child3" />
            </div>

            <div className="deco2">
                <div className="deco_child deco_child1" />
                <div className="deco_child deco_child2" />
                <div className="deco_child deco_child3" />
            </div>
        </MainLayout>
    );
};

export default Home;