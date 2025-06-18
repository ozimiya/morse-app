import { useState, useRef } from 'react';
import { LETTERS } from '../data/letters';
import { playMorse } from '../utils/playMorse';
import { sanitize } from '../utils/sanitize';
import { hiraToKata } from '../utils/kana';
import { useSettings } from '../context/SettingsContext';
import '../styles/components.css';
import './KanaQuiz.css';

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const KanaQuiz = () => {
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [display, setDisplay] = useState('?');
  const [answer, setAnswer] = useState('');
  const { playbackSpeed } = useSettings();
  const shuffledRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const flatLetters = LETTERS.flat();

  const toCodePoints = (str: string): string =>
    Array.from(str.normalize('NFD')).map((c) => c.codePointAt(0)).join('-');

  const isCorrect = (input: string, answer: string) => {
    const a = sanitize(hiraToKata(input));
    const b = sanitize(answer);
    return toCodePoints(a) === toCodePoints(b);
  };

  const start = async () => {
    shuffledRef.current = shuffle(flatLetters);
    currentIndexRef.current = 0;
    setInput('');
    setIsStarted(true);
    setDisplay('?');
    await nextQuestion();
  };

  const nextQuestion = async () => {
    if (currentIndexRef.current >= shuffledRef.current.length) {
      setIsStarted(false);
      setDisplay('完遂セリ');
      return;
    }
    const next = shuffledRef.current[currentIndexRef.current];
    setAnswer(next);
    setDisplay('?');
    await playMorse(next, playbackSpeed);
  };

  const check = async (input: string) => {
    if (isCorrect(input, answer)) {
      setDisplay('💮');
      currentIndexRef.current += 1;
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      setDisplay('❌');
      setTimeout(() => {
        setDisplay('?');
        playMorse(answer, playbackSpeed);
      }, 1500);
    }
    setInput('');
  };

  const handleReplay = () => {
    if (answer) {
      playMorse(answer, playbackSpeed);
    }
  };

  const showAnswer = () => {
    setDisplay(answer);
  };

  return (
    <div className="quiz-container">
      {!isStarted && (
        <button onClick={start} className="button-primary">開始</button>
      )}
      {isStarted && (
        <button onClick={handleReplay} className="button-primary">再打電</button>
      )}

      <div className="question-display">{display}</div>

      <input
        type="text"
        placeholder="入力セヨ"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="text-input"
      />

      <div className="button-group">
        {isStarted && (<button onClick={showAnswer} className="button-secondary">答え</button>)}
        {isStarted && (<button onClick={() => check(input)} className="button-primary">決定</button>)}
      </div>
    </div>
  );
};

export default KanaQuiz;
