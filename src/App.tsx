// import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import KanaQuiz from './pages/KanaQuiz';
import WordQuiz from './pages/WordQuiz';
import Settings from './pages/Settings';
import Header from './components/Header';

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
