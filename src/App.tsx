import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import KanaQuiz from './pages/KanaQuiz';
import WordQuiz from './pages/WordQuiz';
import Settings from './pages/Settings';
import Header from './components/Header';

function App() {

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const handleFocusOut = () => {
      setTimeout(setVH, 100);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('focusout', handleFocusOut);
    };
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
