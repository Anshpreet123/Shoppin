import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Initialize Capacitor PWA elements
defineCustomElements(window);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find root element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
