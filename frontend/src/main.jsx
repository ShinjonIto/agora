import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineProvider } from "@/state/OfflineContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OfflineProvider>
        <App />
      </OfflineProvider>
    </AuthProvider>
  </StrictMode>,
)
