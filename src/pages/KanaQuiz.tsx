import { useState, useRef, useEffect } from 'react';
import { AiOutlineSound } from "react-icons/ai";
import { RiMedalFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import * as Tone from 'tone';
import { LETTERS } from '../data/letters';
import { playMorse } from '../utils/playMorse';
import { sanitize } from '../utils/sanitize';
import { hiraToKata } from '../utils/kana';
import { stopMorse } from '../utils/playMorse';
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

const ROW_LABELS = ['ア', 'カ', 'サ', 'タ', 'ナ', 'ハ', 'マ', 'ヤ', 'ラ', 'ワ', '特殊'];
const SPECIALS = ['ー', '゛', '゜', 'ヰ', 'ヱ'];
const isSpecial = (char: string) => SPECIALS.includes(char);

const KanaQuiz = () => {
  const [input, setInput] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const [display, setDisplay] = useState<React.ReactNode>('?');
  const [answer, setAnswer] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [repeatCount, setRepeatCount] = useState(1);
  const { playbackSpeed } = useSettings();
  const shuffledRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const handler = () => {
      if (Tone.context.state !== 'running') {
        Tone.start();
      }
    };

    document.body.addEventListener('click', handler, { once: true });

    return () => {
      document.body.removeEventListener('click', handler);
      stopMorse();
    };
  }, []);

  const toCodePoints = (str: string): string =>
    Array.from(str.normalize('NFD')).map((c) => c.codePointAt(0)).join('-');

  const isCorrect = (input: string, answer: string) => {
    const a = sanitize(hiraToKata(input));
    const b = sanitize(answer);
    return toCodePoints(a) === toCodePoints(b);
  };

  const toggleRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getFilteredLetters = (): string[] => {
    const selected = selectedRows.length === 0 ? LETTERS : selectedRows.map(i => LETTERS[i]);
    return selected.flat().filter(c => c).flatMap(letter => Array(repeatCount).fill(letter));
  };

  const start = async () => {
    await Tone.start();
    const pool = getFilteredLetters();

    if (pool.length === 0) {
      setDisplay('💮');
      return;
    }

    shuffledRef.current = shuffle(pool);
    currentIndexRef.current = 0;
    setInput('');
    setJustFinished(false);
    setIsStarted(true);
    setDisplay('?');
    await nextQuestion();
  };

  const nextQuestion = async () => {
    if (currentIndexRef.current >= shuffledRef.current.length) {
      setIsStarted(false);
      setJustFinished(true);
      setDisplay('💮');

      setTimeout(() => {
        setJustFinished(false);
      }, 2000);
      return;
    }
    const next = shuffledRef.current[currentIndexRef.current];
    setAnswer(next);
    setDisplay('?');
    await playMorse(next, playbackSpeed);
  };

  const check = async (input: string) => {
    const wasFinal =
      currentIndexRef.current + 1 >= shuffledRef.current.length;

    if (isCorrect(input, answer)) {
      setDisplay(<RiMedalFill color="#ffe666" size="5rem" />);
      currentIndexRef.current += 1;

      setTimeout(() => {
        if (wasFinal) {
          setIsStarted(false);
          setJustFinished(true);
          setDisplay('💮');

          setTimeout(() => {
            setJustFinished(false);
          }, 2000);
        } else {
          nextQuestion();
        }
      }, 1500);
    } else {
      setDisplay(<RxCross2 color="#fa6a58" size="5rem" />);
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
      {justFinished ? (
        <div className={`question-display ${display === '💮' ? 'celebration' : ''}`}>
          {display}
        </div>
      ) : (
        <>
          {!isStarted && (
            <>
              <p className="section-label">出題行を選択</p>
              <div className="letter-row">
                {ROW_LABELS.map((label, i) => (
                  <button
                    key={i}
                    className="round-button"
                    style={{
                      backgroundColor: selectedRows.includes(i) ? '#a2d5f2' : '#ecf0f1',
                    }}
                    onClick={() => toggleRow(i)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="repeat-select">
                <label htmlFor="repeat">出題回数：</label>
                <select
                  id="repeat"
                  value={repeatCount}
                  onChange={(e) => setRepeatCount(Number(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                回
              </div>
              <button onClick={start} className="button-primary">開始</button>
            </>
          )}

          {isStarted && (
            <>
              <div className="question-display">{display}</div>
              <button onClick={handleReplay} className="button-primary">
                <AiOutlineSound className="icon-sound" size="2rem" />
                もう１回
              </button>

              {isSpecial(answer) ? (
                <div className="symbol-button-row">
                  {SPECIALS.map((symbol) => (
                    <button
                      key={symbol}
                      className="round-button"
                      onClick={() => check(symbol)}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="入力セヨ"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="text-input"
                />
              )}

              <div className={`button-group ${isSpecial(answer) ? 'symbol-only' : ''}`}>
                <button onClick={showAnswer} className="button-secondary">わからん</button>
                {!isSpecial(answer) && (
                  <button onClick={() => check(input)} className="button-primary">決定</button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default KanaQuiz;
