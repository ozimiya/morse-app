import { useState, useEffect } from 'react';
import { AiOutlineSound } from "react-icons/ai";
import * as Tone from 'tone';
import { WORDS } from '../data/words';
import { useSettings } from '../context/SettingsContext';
import { sanitize } from '../utils/sanitize';
import { hiraToKata } from '../utils/kana';
import { useMorseQuiz } from '../hooks/useMorseQuiz';
import '../styles/components.css';
import './WordQuiz.css';

// 見た目の文字数をカウント（NFC正規化で濁点・半濁点を結合）
const countGraphemes = (str: string): number => {
  return [...str.normalize('NFC')].length;
};

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandomWithRepeat<T>(list: T[], count: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    const random = list[Math.floor(Math.random() * list.length)];
    result.push(random);
  }
  return result;
}

const WordQuiz = () => {
  const { playbackSpeed, lengthFilter, setLengthFilter } = useSettings();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const [repeatCount, setRepeatCount] = useState(10);

  const filteredWords = lengthFilter > 0
    ? WORDS.filter((w) => countGraphemes(w) === lengthFilter)
    : WORDS;

  const repeatedWords = repeatCount <= filteredWords.length
    ? shuffle(filteredWords).slice(0, repeatCount)
    : pickRandomWithRepeat(filteredWords, repeatCount);

  const toCodePoints = (str: string): string =>
    Array.from(str.normalize('NFD')).map((c) => c.codePointAt(0)).join('-');

  const isCorrect = (input: string, answer: string) => {
    const a = sanitize(hiraToKata(input));
    const b = sanitize(answer);
    return toCodePoints(a) === toCodePoints(b);
  };

  const { answer, display, start, check, setDisplay } = useMorseQuiz(repeatedWords, {
    getWpm: () => playbackSpeed,
    isCorrect,
    onFinish: () => {
      setIsStarted(false);
      setJustFinished(true);
      setDisplay('完遂セリ');
      setTimeout(() => {
        setJustFinished(false);
      }, 2000);
    },
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
    setDisplay('?');
    await start();
  };

  const handleCheck = () => {
    check(input);
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
      {!isStarted && !justFinished && (
        <>
          <div className="length-select">
            <label htmlFor="length">出題文字数：</label>
            <select
              id="length"
              value={lengthFilter}
              onChange={(e) => setLengthFilter(Number(e.target.value))}
            >
              <option value={0}>指定なし</option>
              <option value={2}>2文字</option>
              <option value={3}>3文字</option>
              <option value={4}>4文字</option>
              <option value={5}>5文字</option>
            </select>
          </div>

          <div className="repeat-select">
            <label htmlFor="repeat">出題回数：</label>
            <select
              id="repeat"
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number(e.target.value))}
            >
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <button onClick={handleStart} className="button-primary">開始</button>
        </>
      )}

      {(isStarted || justFinished) && (
        <div className="question-display">{display}</div>
      )}

      {isStarted && (
        <>
          <button onClick={handleReplay} className="button-primary">
            <AiOutlineSound className="icon-sound" size="2rem" />
            もう１回
          </button>

          <input
            type="text"
            placeholder="入力セヨ"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="text-input"
          />

          <div className="button-group">
            <button onClick={handleShowAnswer} className="button-secondary">答え</button>
            <button onClick={handleCheck} className="button-primary">決定</button>
          </div>
        </>
      )}

      <div className="feedback">{feedback}</div>
    </div>
  );
};

export default WordQuiz;
