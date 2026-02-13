import MainLayout from "../layouts/MainLayout";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "./Home.css";


const Home = () => {

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