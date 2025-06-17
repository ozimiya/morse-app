// export const hiraToKata = (str: string) =>
//   str.replace(/[\u3041-\u3096]/g, (ch) =>
//     String.fromCharCode(ch.charCodeAt(0) + 0x60)
//   );

// utils/kana.ts などに置くと良い
// ひらがな → カタカナ変換（NFC正規化も含む）

/**
 * ひらがな文字を全てカタカナに変換する
 * ex: そば → ソバ
 */
export const hiraToKata = (input: string): string => {
  const HIRAGANA_REGEX = /[\u3041-\u3096]/g; // ひらがな Unicode 範囲

  return input
    .replace(HIRAGANA_REGEX, (char) =>
      String.fromCharCode(char.charCodeAt(0) + 0x60) // ひらがな→カタカナにズラす
    )
    .normalize('NFC'); // 正規化（濁点などを結合済みにする）
};
