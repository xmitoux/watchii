export default function CharacterIndex() {
  if (typeof window !== 'undefined') {
    // 当該キャラクターの最初のページにリダイレクト
    window.location.href = `${window.location.href}/page/1`;
  }
  return null;
}
