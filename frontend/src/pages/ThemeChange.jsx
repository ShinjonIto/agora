import MainLayout from "../layouts/MainLayout";
import { applyTheme } from "../theme/theme";
import Flower from "@/assets/images/deco/flower.svg?react";
import "./Home.css"; 

const ThemeChange = () => {
    return (
        <div>
            <div style={{ padding: "20px" }}>
                <h2>テーマ変更</h2>
                <button onClick={() => applyTheme("normal")}>ノーマル</button>
                <button onClick={() => applyTheme("spring")}>春</button>
                <button onClick={() => applyTheme("summer")}>夏</button>
            </div>

            {/* デコレーション */}
            <div className="deco">
                <Flower className="deco_child1" />
                <Flower className="deco_child2" />
                <Flower className="deco_child3" />
            </div>
        </div>
    );
};

export default ThemeChange;