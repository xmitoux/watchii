export default function FavsIndex() {
  if (typeof window !== 'undefined') {
    // お気に入り画面にリダイレクト
    window.location.href = '/favs/page/1';
  }
  return null;
}
