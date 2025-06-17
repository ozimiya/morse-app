import { useState } from 'react';
import { playMorse } from '../utils/playMorse';

type Options = {
  getWpm?: () => number;
  isCorrect?: (input: string, answer: string) => boolean;
};

export function useMorseQuiz(items: string[], options?: Options) {
  const [answer, setAnswer] = useState('');
  const [display, setDisplay] = useState('?');

  const getWpm = options?.getWpm ?? (() => 12); // デフォルト12WPM
  const isCorrect = options?.isCorrect ?? ((input, ans) => input === ans);

  const start = async () => {
    const next = items[Math.floor(Math.random() * items.length)];
    setAnswer(next);
    setDisplay('?');
    await playMorse(next, getWpm());
  };

  const check = async (input: string) => {
    if (isCorrect(input, answer)) {
      setDisplay('💮');
      setTimeout(() => {
        start();
      }, 1500);
    } else {
      setDisplay('❌');
      setTimeout(() => {
        setDisplay('?');
        playMorse(answer, getWpm());
      }, 1500);
    }
  };

  return { display, answer, start, check };
}
