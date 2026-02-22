import React, { createContext, useContext, useMemo, useState } from "react";

const OfflineContext = createContext(null);

export function OfflineProvider({ children }) {
    const [offlineOpen, setOfflineOpen] = useState(false);

    const api = useMemo(() => ({
        offlineOpen,
        openOffline: () => setOfflineOpen(true),
        closeOffline: () => setOfflineOpen(false),
        setOfflineOpen,
    }), [offlineOpen]);

    // axios interceptor から呼ぶために一時的に window へ（慣れたら消してOK）
    window.__setOfflineOpen = setOfflineOpen;

    return <OfflineContext.Provider value={api}>{children}</OfflineContext.Provider>;
}

export function useOffline() {
    const ctx = useContext(OfflineContext);
    if (!ctx) throw new Error("useOffline must be used within OfflineProvider");
    return ctx;
}