// src/context/SettingsContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Settings = {
  lengthFilter: number;
  playbackSpeed: number;
  setLengthFilter: (len: number) => void;
  setPlaybackSpeed: (speed: number) => void;
};

const SettingsContext = createContext<Settings | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [lengthFilter, setLengthFilter] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(11); // 1倍速

  return (
    //value={{ lengthFilter,..}}ここで設定した値を、アプリ全体に配る
    <SettingsContext.Provider value={{ lengthFilter, playbackSpeed, setLengthFilter, setPlaybackSpeed }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('SettingsContextが未定義です');
  return context;
};
