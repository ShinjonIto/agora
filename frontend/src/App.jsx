import { useEffect, useState } from "react";
import axios from "axios";
import UserIcon from "./components/UserIcon";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("/users/1/icon/").then((res) => {
      setUser(res.data);
    });
  }, []);

  if (!user) return <p>Loading...</p>;

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
      <img
        src={user.icon_image}
        alt="user icon"
        width={100}
        height={100}
        style={{ borderRadius: "50%" }}
      />
      <p>{user.user_name}</p>
      {/* UserIcon表示 */}
      <UserIcon userId={1} />
    </div>
  );
}

export default App;
