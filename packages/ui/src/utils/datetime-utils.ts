/**
 * ISO8601形式の文字列を日本時間にフォーマットするユーティリティ関数
 */

/**
 * ISO8601形式の文字列を指定されたフォーマットの日本時間の文字列に変換する
 * @param isoString - ISO8601形式の日付文字列（例: '2023-04-01T12:00:00Z'）
 * @param format - 出力フォーマット（デフォルト: 'YYYY/MM/DD HH:mm'）
 * @returns フォーマットされた日本時間の文字列
 */
export const formatToJST = (
  isoString: string,
  format: string = 'YYYY/MM/DD HH:mm',
): string => {
  if (!isoString) {
    return '';
  }

  // 日付オブジェクトを作成（UTCとして解釈される）
  const date = new Date(isoString);

  // 日本時間のタイムゾーンオフセット（+9時間）
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  // フォーマットパターンに従って文字列を構築
  let result = format;

  // 年（YYYY）
  result = result.replace('YYYY', jstDate.getUTCFullYear().toString());

  // 月（MM）- getUTCMonthは0から始まるので+1する
  const month = jstDate.getUTCMonth() + 1;
  result = result.replace('MM', month.toString().padStart(2, '0'));

  // 日（DD）
  const day = jstDate.getUTCDate();
  result = result.replace('DD', day.toString().padStart(2, '0'));

  // 時（HH）
  const hours = jstDate.getUTCHours();
  result = result.replace('HH', hours.toString().padStart(2, '0'));

  // 分（mm）
  const minutes = jstDate.getUTCMinutes();
  result = result.replace('mm', minutes.toString().padStart(2, '0'));

  // 秒（ss）
  const seconds = jstDate.getUTCSeconds();
  result = result.replace('ss', seconds.toString().padStart(2, '0'));

  return result;
};
