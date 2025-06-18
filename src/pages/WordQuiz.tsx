import { useState, useEffect } from 'react';
import * as Tone from 'tone';
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
  const [_correctCount, setCorrectCount] = useState(0);

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

  const { answer, display, start, check, setDisplay } = useMorseQuiz(filteredWords, {
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

  const handleStart = async () => {
    await Tone.start();
    setIsStarted(true);
    setCorrectCount(0);
    setDisplay('?');
    await start();
  };

  const handleCheck = () => {
    check(input);
    if (isCorrect(input, answer)) {
      setCorrectCount((prev) => {
        const next = prev + 1;
        if (next >= 10) {
          setIsStarted(false);
          setDisplay('完遂セリ');
          return 0;
        }
        return next;
      });
    }
    setInput('');
  };

  const handleReplay = () => {
    import('../utils/playMorse').then(({ playMorse }) => {
      playMorse(answer, playbackSpeed);
    });
  };

  const handleShowAnswer = () => {
    setDisplay(answer);
  };

  return (
    <div className="quiz-container">
      {!isStarted && (
        <button onClick={handleStart} className="button-primary">開始</button>
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
        {isStarted && (
          <>
            <button onClick={handleShowAnswer} className="button-secondary">答え</button>
            <button onClick={handleCheck} className="button-primary">決定</button>
          </>
        )}
      </div>

      <div className="feedback">{feedback}</div>
    </div>
  );
};

export default WordQuiz;
