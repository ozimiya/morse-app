import { useState } from 'react';
import { playMorse, stopMorse } from '../utils/playMorse';

type Options = {
  getWpm?: () => number;
  isCorrect?: (input: string, answer: string) => boolean;
};

export function useMorseQuiz(items: string[], options?: Options) {
  const [answer, setAnswer] = useState('');
  const [display, setDisplay] = useState('?');

  const getWpm = options?.getWpm ?? (() => 12);
  const isCorrect = options?.isCorrect ?? ((input, ans) => input === ans);

  const start = async () => {
    stopMorse();
    const next = items[Math.floor(Math.random() * items.length)];
    setAnswer(next);
    setDisplay('?');
    await playMorse(next, getWpm());
  };

  const check = async (input: string) => {
    stopMorse();
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
      }, 2000);
    }
  };

  return { display, answer, start, check, setDisplay };
}
