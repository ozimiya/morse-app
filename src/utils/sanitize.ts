export const sanitize = (str: string): string => {
    return str
      .normalize('NFD')
      .replace(/\u309B/g, '\u3099') // 通常の濁点→合成用濁点
      .replace(/\u309C/g, '\u309A') // 半濁点も同様に変換
      .replace(/\s/g, '')
      .replace(/[\u3000]/g, '')
      .toUpperCase();
  };