// import { useLayoutEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import KanaQuiz from './pages/KanaQuiz';
import WordQuiz from './pages/WordQuiz';
import Settings from './pages/Settings';
import Header from './components/Header';

function App() {

  const setVH = () => {
    const vh = (window.visualViewport?.height || window.innerHeight) * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  window.addEventListener('resize', setVH);
  window.visualViewport?.addEventListener('resize', setVH); // ← 追加！！
  setVH();

  // ← 高さの調整処理（dev環境でも安定させる）
  // useLayoutEffect(() => {
  //   const setVH = () => {
  //     const vh = window.innerHeight * 0.01;
  //     document.documentElement.style.setProperty('--vh', `${vh}px`);
  //   };

  //   requestAnimationFrame(setVH); // ← dev対策：描画直前に実行
  //   window.addEventListener('resize', setVH);
  //   return () => window.removeEventListener('resize', setVH);
  // }, []);

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
