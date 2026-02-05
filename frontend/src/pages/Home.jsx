import MainLayout from "../layouts/MainLayout";
import PostList from "../components/PostList";
import Sidebar from "../components/Sidebar";
import "./Home.css";


const Home = () => {

    return (
        <div>
            <MainLayout />


            <div className="homeLayout">
                {/* サイドバー */}
                <Sidebar className="sidebar" />

                {/* 記事一覧 */}
                <div className="PostList">
                    <PostList />
                </div>
            </div>
        </div>
    );
};

export default Home;