import { useState } from 'react';
import { playMorse, stopMorse } from '../utils/playMorse';

type Options = {
  getWpm?: () => number;
  isCorrect?: (input: string, answer: string) => boolean;
  onFinish?: () => void;
};

export function useMorseQuiz(items: string[], options?: Options) {
  const [answer, setAnswer] = useState('');
  const [display, setDisplay] = useState('?');
  const [index, setIndex] = useState(0);

  const getWpm = options?.getWpm ?? (() => 12);
  const isCorrect = options?.isCorrect ?? ((input, ans) => input === ans);

  const nextQuestion = async () => {
    if (index >= items.length) {
      stopMorse();
      options?.onFinish?.();
      return;
    }
    const next = items[index];
    setAnswer(next);
    setDisplay('?');
    await playMorse(next, getWpm());
    setIndex(index + 1);
  };

  const start = async () => {
    setIndex(0);
    await nextQuestion();
  };

  const check = async (input: string) => {
    stopMorse();
    if (isCorrect(input, answer)) {
      setDisplay('💮');
      setTimeout(() => {
        nextQuestion();
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
