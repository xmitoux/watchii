export default function Index() {
  if (typeof window !== 'undefined') {
    // ホーム画面1ページ目にリダイレクト
    window.location.href = '/1';
  }
  return null;
}
