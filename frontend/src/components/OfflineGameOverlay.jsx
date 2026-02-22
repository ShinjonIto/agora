import React from "react";
import "./OfflineGameOverlay.css";

export default function OfflineGameOverlay({ open, onRetry, onClose }) {
    if (!open) return null;

    return (
        <div className="offline-overlay" role="dialog" aria-modal="true">
            <div className="offline-panel">
                <div className="offline-head">
                    <div className="offline-title">通信エラー！ゲームしながら復帰待ち…</div>

                    <div className="offline-actions">
                        <button className="offline-btn" onClick={onRetry}>再読み込み</button>
                        <button className="offline-btn ghost" onClick={onClose}>閉じる</button>
                    </div>
                </div>

                <iframe
                    className="offline-iframe"
                    title="tomato-game"
                    src="/game_tomato/index.html"
                />
            </div>
        </div>
    );
}