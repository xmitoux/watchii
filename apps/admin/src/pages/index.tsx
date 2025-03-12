export default function Index() {
  if (typeof window !== 'undefined') {
    // ホーム画面にリダイレクト
    window.location.href = '/home';
  }
  return null;
}
