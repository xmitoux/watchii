export default function HomeIndex() {
  if (typeof window !== 'undefined') {
    // ホーム画面にリダイレクト
    window.location.href = '/home/page/1';
  }
  return null;
}
