import MainLayout from "../layouts/MainLayout";
import PostList from "../components/PostList";
import Sidebar from "../components/Sidebar";


const Home = () => {
    
    return (
        <div>
        <MainLayout />

        {/* サイドバー */}
        <Sidebar />

        {/* 記事一覧 */}
        <PostList />
        </div>
    );
};

export default Home;
