// import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import KanaQuiz from './pages/KanaQuiz';
import WordQuiz from './pages/WordQuiz';
import Settings from './pages/Settings';
import Header from './components/Header';

function App() {

  // useEffect(() => {
  //   const setVH = () => {
  //     const rawHeight =
  //       window.visualViewport?.height || window.innerHeight;
  //     const vh = rawHeight * 0.01;
  //     document.documentElement.style.setProperty('--vh', `${vh}px`);
  //   };

  //   const handleFocusOut = () => {
  //     setTimeout(setVH, 100);
  //   };

  //   // 初期表示に確実に反映
  //   requestAnimationFrame(setVH);

  //   window.addEventListener('resize', setVH);
  //   window.visualViewport?.addEventListener('resize', setVH);
  //   window.addEventListener('focusout', handleFocusOut);

  //   return () => {
  //     window.removeEventListener('resize', setVH);
  //     window.visualViewport?.removeEventListener('resize', setVH);
  //     window.removeEventListener('focusout', handleFocusOut);
  //   };
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
