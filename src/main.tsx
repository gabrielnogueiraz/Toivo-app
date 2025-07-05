import { createRoot } from 'react-dom/client'
import App from './app'
import './index.css'

// Importar debug utils apenas em desenvolvimento
if (import.meta.env.DEV) {
  import('./utils/authDebug');
}

createRoot(document.getElementById("root")!).render(<App />);