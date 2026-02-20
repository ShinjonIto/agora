import { useEffect, useRef } from "react";

const RichContent = ({ html, stopClickPropagation = false }) => {
    const rootRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        console.log("RichContent html length:", html?.length);
        console.log("pre count:", root.querySelectorAll("pre").length);
        console.log("ql-code-block count:", root.querySelectorAll(".ql-code-block").length);
    }, [html]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        // すでにボタン付いてるpreには二重で付けない
        const pres = root.querySelectorAll("pre");
        pres.forEach((pre) => {
            if (pre.dataset.copyReady === "true") return;
            pre.dataset.copyReady = "true";

            // pre をラップしてボタン置き場を作る
            const wrapper = document.createElement("div");
            wrapper.className = "codeblock-wrap";

            // preの直前にwrapperを入れて、preをwrapperに移動
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            // ボタン作成
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "codeblock-copy";
            btn.textContent = "コピー";

            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Quillのコードは pre.textContent でOK
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
                    // 古いブラウザ向けフォールバック
                    try {
                        const ta = document.createElement("textarea");
                        ta.value = codeText;
                        ta.style.position = "fixed";
                        ta.style.opacity = "0";
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand("copy");
                        document.body.removeChild(ta);

                        const prev = btn.textContent;
                        btn.textContent = "コピーしました";
                        btn.disabled = true;
                        setTimeout(() => {
                            btn.textContent = prev;
                            btn.disabled = false;
                        }, 1200);
                    } catch (e2) {
                        console.error("copy failed:", err, e2);
                    }
                }
            });

            wrapper.appendChild(btn);
        });
    }, [html]);

    return (
        <div
            ref={rootRef}
            className="editor"
            onClick={(e) => {
                if (!stopClickPropagation) return;
                // 親のカードクリック（詳細遷移）を止めたい要素
                if (e.target.closest("a, button, pre, code, iframe")) {
                    e.stopPropagation();
                }
            }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default RichContent;