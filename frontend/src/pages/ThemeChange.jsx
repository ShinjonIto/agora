import { useMemo } from "react";
import { applyTheme } from "../theme/theme";
import Flower from "@/assets/images/deco/flower.svg?react";
import "./ThemeChange.css";

const ThemeChange = () => {
    const themes = useMemo(
        () => [
            // { key: "normal", label: "ノーマル", desc: "基本の落ち着いた配色" },
            { key: "spring", label: "春", desc: "やわらかく明るい雰囲気" },
            { key: "summer", label: "夏", desc: "涼しげで元気な雰囲気" },
            // { key: "autumn", label: "秋", desc: "落ち葉のようなあたたかい色" },
            // { key: "winter", label: "冬", desc: "静かで透明感のある色合い" },
        ],
        []
    );

    return (
        <div className="themePage">
            <div className="themeCard">
                <header className="themeHeader">
                    <h2 className="themeTitle">テーマ変更</h2>
                    <p className="themeSubtitle">ボタンをおして好きなテーマに変更しよう！</p>
                </header>

                <div className="themeGrid">
                    {themes.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            className="themeBtn"
                            onClick={() => applyTheme(t.key)}
                        >
                            <span className="themeBtnLabel">{t.label}</span>
                            <span className="themeBtnDesc">{t.desc}</span>
                        </button>
                    ))}
                </div>

                <div className="themeHint">
                    <p className="themeHintText">選ぶとすぐ反映されます。</p>
                </div>
            </div>

            {/* デコレーション */}
            <div className="themeDeco">
                <Flower className="deco_child1" />
                <Flower className="deco_child2" />
                <Flower className="deco_child3" />
            </div>
        </div>
    );
};

export default ThemeChange;