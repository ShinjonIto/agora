import React, { useMemo } from "react";

export default function Burst({
    fxKey,
    count = 12,         // 粒の数
    spread = 28,        // 飛ぶ距離(px) ここが「広がり」コントローラ
    size = 4,           // 粒の大きさ(px)
    duration = 520,     // ms
    className = "",
}) {
    // fxKey が変わるたびに粒の配置を作り直して「毎回発火」させる
    const dots = useMemo(() => {
        const rings = 3;                 // リング数（2でもOK）
        const counts = [6, 8, 10];        // 各リングの粒数（合計 = 24）
        // ↑countで管理したいなら後で調整案も出す。まずは固定がラク。

        const maxR = spread;             // 一番外側の距離
        const minR = spread * 0.45;      // 一番内側の距離（中心寄り）
        const stepR = (maxR - minR) / (rings - 1);

        const maxS = size;               // 最大サイズは今の size を上限にする
        const minS = size * 0.45;        // 内側は小さく（好みで0.35〜0.6）

        const arr = [];

        for (let ring = 0; ring < rings; ring++) {
            const n = counts[ring] ?? 8;
            const r = minR + stepR * ring;

            // 0〜1の進行度：外側ほど1
            const t = rings === 1 ? 1 : ring / (rings - 1);

            // サイズ：外側ほど大きい（最大はmaxS）
            const s = minS + (maxS - minS) * t;

            for (let i = 0; i < n; i++) {
                const angle = (Math.PI * 2 * i) / n;

                // リングごとに少し角度をずらすと綺麗（花びらっぽくなる）
                const offset = (ring * Math.PI) / n;
                const a = angle + offset;

                const x = Math.cos(a) * r;
                const y = Math.sin(a) * r;

                arr.push({ x, y, s, delay: ring * 12 }); // 外側ちょい遅れで気持ち良い
            }
        }

        return arr;
    }, [fxKey, spread, size]);

    return (
        <span
            key={fxKey}
            className={`fx-burst ${className}`}
            style={{ "--fx-duration": `${duration}ms` }}
            aria-hidden="true"
        >
            {dots.map((d, i) => (
                <span
                    key={i}
                    className="fx-dot"
                    style={{
                        "--dx": `${d.x}px`,
                        "--dy": `${d.y}px`,
                        "--ds": `${d.s}px`,
                        "--dd": `${d.delay}ms`,
                    }}
                />
            ))}
        </span>
    );
}
