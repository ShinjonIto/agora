import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header/Header";
import CreatePostButton from "@/components/CreatePostButton";

const MainLayout = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <div className="layout">
            <div className="header">
                <Header user={user} />
            </div>

            <main className="main">
                {children}
            </main>

            <CreatePostButton />
        </div>
    );
};

export default MainLayout;