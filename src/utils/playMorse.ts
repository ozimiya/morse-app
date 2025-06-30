import * as Tone from 'tone';
import { MORSE_CODE_MAP } from '../data/morseMap';

// グローバルに synth を保持
let currentSynth: Tone.Synth | null = null;

export const stopMorse = () => {
  Tone.Transport.cancel(); // スケジュールされた音を全部消す
  if (currentSynth) {
    currentSynth.dispose(); // 前の音源を完全に破棄
    currentSynth = null;
  }
};

export const playMorse = async (text: string, playbackSpeedWpm = 12) => {
  stopMorse(); // 前の音を止めてから再生

  await Tone.start();

  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: {
      attack: 0.001,
      decay: 0.01,
      sustain: 0.5,
      release: 0.1,
    },
  }).toDestination();

  currentSynth = synth;

  const unit = 60 / (playbackSpeedWpm * 50); // ドットの長さ
  const dot = unit;
  const dash = dot * 3;
  const space_between_elements = dot;
  const space_between_letters = dot * 3;

  let time = 0;

  for (const char of Array.from(text.normalize('NFC'))) {
    const code = MORSE_CODE_MAP[char];
    if (!code) continue;

    for (const mark of code) {
      if (mark === '・') {
        synth.triggerAttackRelease('C4', dot, `+${time}`);
        time += dot + space_between_elements;
      } else if (mark === '－') {
        synth.triggerAttackRelease('C4', dash, `+${time}`);
        time += dash + space_between_elements;
      } else {
        time += space_between_elements;
      }
    }

    time += space_between_letters;
  }
};
