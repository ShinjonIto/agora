import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "./Home.css";
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
        </MainLayout>
    );
};

export default Home;