import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export default function Modal({
    open,
    onClose,
    title,
    children,
    size = "md",
    closeOnBackdrop = true,
}) {
    const [anim, setAnim] = useState(false);

    useEffect(() => {
        if (!open) return;

        const id = requestAnimationFrame(() => setAnim(true));

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            cancelAnimationFrame(id);
            setAnim(false);
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    const container = document.getElementById("modal-root");
    if (!container) return null; // ★ここ超大事（ない時に落とさない）

    const sizeClass =
        size === "sm" ? "ModalPanel--sm" : size === "lg" ? "ModalPanel--lg" : "ModalPanel--md";

    return createPortal(
        <div className="ModalRoot" role="dialog" aria-modal="true">
            <button
                className={`ModalBackdrop ${anim ? "is-open" : ""}`}
                aria-label="閉じる"
                onClick={() => closeOnBackdrop && onClose?.()}
            />
            <div className={`ModalPanel ${sizeClass} ${anim ? "is-open" : ""}`}>
                <div className="ModalHeader">
                    {title ? <h2 className="ModalTitle">{title}</h2> : <div />}
                    <button className="ModalClose" onClick={onClose} aria-label="閉じる" type="button">
                        ✕
                    </button>
                </div>

                <div className="ModalBody">{children}</div>
            </div>
        </div>,
        container
    );
}