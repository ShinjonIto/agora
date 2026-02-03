import { useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside>
            <button onClick={() => navigate("/")}>ホーム</button>
            <button onClick={() => navigate("/department/mch")}>自動車学科</button>
            <button onClick={() => navigate("/department/cyc")}>バイシクル学科</button>
            <button onClick={() => navigate("/department/sys")}>情報システム学科</button>         
        </aside>
    )
}

export default Sidebar;