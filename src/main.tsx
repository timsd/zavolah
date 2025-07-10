import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeSecurity } from './lib/security'

// Initialize security measures
try {
  initializeSecurity()
} catch (error) {
  console.error('Security initialization failed:', error)
}

createRoot(document.getElementById("root")!).render(<App />);
