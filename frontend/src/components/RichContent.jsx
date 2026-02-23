import { useEffect, useRef } from "react";
import "./RichContent.css"
const RichContent = ({ html, stopClickPropagation = false }) => {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const pres = root.querySelectorAll("pre");
        pres.forEach((pre) => {
            if (pre.dataset.copyReady === "true") return;
            pre.dataset.copyReady = "true";

            // preがボタンを置けるようにする（CSSでも可）
            pre.classList.add("codeblock-pre");

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "codeblock-copy";
            btn.textContent = "コピー";

            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const codeText = pre.textContent || "";
                try {
                    await navigator.clipboard.writeText(codeText);

                    const prev = btn.textContent;
                    btn.textContent = "コピーしました";
                    btn.disabled = true;
                    setTimeout(() => {
                        btn.textContent = prev;
                        btn.disabled = false;
                    }, 1200);
                } catch (err) {
                    console.error("copy failed:", err);
                }
            });

            // ★ wrapperに移さず、preの先頭に差し込む
            pre.prepend(btn);
        });
    }, [html]);

    return (
        <div
            ref={rootRef}
            className="editor"
            onClick={(e) => {
                if (!stopClickPropagation) return;
                if (e.target.closest("a, button, pre, code, iframe")) {
                    e.stopPropagation();
                }
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default RichContent;