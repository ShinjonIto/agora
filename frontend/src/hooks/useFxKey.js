import { useState, useCallback } from "react";

export const useFxKey = () => {
    const [fxKey, setFxKey] = useState(0);
    const [showFx, setShowFx] = useState(false);

    const triggerFx = useCallback((durationMs = 450) => {
        setFxKey((k) => k + 1);
        setShowFx(true);
        window.setTimeout(() => setShowFx(false), durationMs);
    }, []);

    return { fxKey, showFx, triggerFx };
};