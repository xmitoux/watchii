/**
 * 型安全なOmit
 * @template T Omit対象のtype
 * @template U Tのキー名のUnion型
 */
export type OmitSafe<T, U extends keyof T> = Omit<T, U>;

/**
 * type内の指定したプロパティを上書きする
 * @template T 上書き対象のtype
 * @template U 上書きするプロパティ
 */
export type Overwrite<T, U extends { [Key in keyof T]?: unknown }> = Omit<T, keyof U> & U;
