import UserIcon from "../components/UserProfile";

const Home = () => {
    return (
        <div
        style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}
        >
        <h1>Home</h1>

        {/* ユーザーアイコン表示 */}
        <UserIcon userId={1} />
        </div>
    );
};

export default Home;
