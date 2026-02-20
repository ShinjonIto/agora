import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "./Home.css";


import Flower from "@/assets/images/deco/flower.svg?react";
// import usePostAction from "@/hooks/usePostActions";

const Home = () => {
    // const { dept } = useParams();

    // ⭐ ページごとにscroll保存
    // const usePostActions = useScrollRestoration(`home:${dept || "all"}`);

    return (
        <MainLayout>

            <div className="homeLayout">
                {/* サイドバー */}
                <Sidebar className="sidebar" />

                {/* {ホーム内の表示が切り替わる部分} */}
                <div className="main_contents">
                    <div className="PostListBody">
                        <div className="postListScroll">
                            <Outlet />
                        </div>


                    </div>
                </div>

            </div>
            <div className="deco">
                <Flower className="deco_child1" />
                <Flower className="deco_child2" />
                <Flower className="deco_child3" />
            </div>

            <div className="deco2">
                <Flower className="deco_child1" />
                <Flower className="deco_child2" />
                <Flower className="deco_child3" />
            </div>

        </MainLayout>
    );
};

export default Home;