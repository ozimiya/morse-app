import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import KanaQuiz from './pages/KanaQuiz';
import WordQuiz from './pages/WordQuiz';
import Settings from './pages/Settings';
import Header from './components/Header';

function App() {
  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (window.confirm('新しいバージョンがあります。再読み込みしますか？')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log('オフラインで使用できます！');
      },
    });
  }, []);

  return (
    <>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<KanaQuiz />} />
          <Route path="/words" element={<WordQuiz />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
