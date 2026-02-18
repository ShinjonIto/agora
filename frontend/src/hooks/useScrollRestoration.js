import { useEffect, useRef } from "react";

/**
 * 独自スクロール領域の scrollTop を保存 & 復元する
 * @param {string} key sessionStorageに保存するキー（例: "home", "dept:mch"）
 */
export default function useScrollRestoration(key) {
    const ref = useRef(null);

    // 復元
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const saved = sessionStorage.getItem(`scroll:${key}`);
        if (saved != null) {
            el.scrollTop = Number(saved);
        }
    }, [key]);

    // 保存
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onScroll = () => {
            sessionStorage.setItem(`scroll:${key}`, String(el.scrollTop));
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [key]);

    return ref;
}
