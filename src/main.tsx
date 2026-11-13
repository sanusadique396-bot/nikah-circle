import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Automatically unregister any legacy service workers and clear stale caches to ensure updates reflect immediately
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}
if ('caches' in window) {
  caches.keys().then((keys) => {
    keys.forEach((key) => caches.delete(key));
  });
}

createRoot(document.getElementById('root')!).render(<App />);
