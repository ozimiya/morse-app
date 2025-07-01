import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './context/SettingsContext';

import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('新しいバージョンがあります。ページを更新しますか？')) {
      if (typeof updateSW === 'function') {
        updateSW(true);
      } else {
        window.location.reload();
      }
    }
  },
  onOfflineReady() {
    console.log('オフラインでも使えます');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
