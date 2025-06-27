import { Routes, Route } from 'react-router-dom';
import KanaQuiz from './pages/KanaQuiz';
import WordQuiz from './pages/WordQuiz';
import Settings from './pages/Settings';
import Header from './components/Header';

const setVH = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// 初回とリサイズ時に反映
window.addEventListener('resize', setVH);
setVH();

function App() {
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
