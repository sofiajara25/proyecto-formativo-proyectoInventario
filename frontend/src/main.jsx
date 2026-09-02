import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
// Se importa antes que nada más: envuelve window.fetch para detectar en
// toda la app cuando el backend invalida la sesión (ver authFetchGuard.js).
import '@/shared/utils/authFetchGuard'
import App from './app/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
