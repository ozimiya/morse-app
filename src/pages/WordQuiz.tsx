import { useState, useEffect } from 'react';
import * as Tone from 'tone'; // ←これを追加！
import { WORDS } from '../data/words';
import { useSettings } from '../context/SettingsContext';
import { sanitize } from '../utils/sanitize';
import { hiraToKata } from '../utils/kana';
import { useMorseQuiz } from '../hooks/useMorseQuiz';
import '../styles/components.css';
import './WordQuiz.css';

const WordQuiz = () => {
  const { playbackSpeed, lengthFilter } = useSettings();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const filteredWords = lengthFilter > 0
    ? WORDS.filter((w) => w.length === lengthFilter)
    : WORDS;

  const toCodePoints = (str: string): string =>
    Array.from(str.normalize('NFD')).map((c) => c.codePointAt(0)).join('-');

  const isCorrect = (input: string, answer: string) => {
    const a = sanitize(hiraToKata(input));
    const b = sanitize(answer);
    return toCodePoints(a) === toCodePoints(b);
  };

  const { answer, display, start, check } = useMorseQuiz(filteredWords, {
    getWpm: () => playbackSpeed,
    isCorrect,
  });

  useEffect(() => {
    if (filteredWords.length === 0) {
      setFeedback(`${lengthFilter}文字の単語が見つかりませんでした`);
    } else {
      setFeedback('');
    }
  }, [lengthFilter, filteredWords]);

  useEffect(() => {
  const handler = () => {
    if (Tone.context.state !== 'running') {
      Tone.start();
    }
  };

  document.body.addEventListener('click', handler, { once: true });

  return () => {
    document.body.removeEventListener('click', handler);
  };
}, []);

  const handleStart = async () => {
    await Tone.start();
    setIsStarted(true);
    setCorrectCount(0);
    await start();
  };

  const handleCheck = () => {
    check(input);
    if (isCorrect(input, answer)) {
      setCorrectCount((prev) => prev + 1);
      if (correctCount + 1 >= 10) {
        setIsStarted(false);
        setCorrectCount(0);
      }
    }
  };

  const handleReplay = () => {
    if (answer) {
      import('../utils/playMorse').then(({ playMorse }) => {
        playMorse(answer, playbackSpeed);
      });
    }
  };

  const showAnswer = () => {
    setFeedback(answer);
  };

  return (
    <div className="quiz-container">
      {!isStarted && (
        <button onClick={async () => {
            await Tone.start();
            handleStart();
          }} className="button-primary">開始</button>
      )}
      {isStarted && (
        <button onClick={handleReplay} className="button-primary">再打電</button>
      )}

      {/* <div className="question-display">{display}</div> */}
      <div className="feedback">{feedback}</div>

      <input
        type="text"
        placeholder="入力セヨ"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="text-input"
      />

      <div className="button-group">
        {isStarted && (<button onClick={showAnswer} className="button-secondary">答え</button>)}
        {isStarted && (<button onClick={handleCheck} className="button-primary">決定</button>)}
      </div>
    </div>
  );
};

export default WordQuiz;
