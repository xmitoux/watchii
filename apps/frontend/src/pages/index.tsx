export default function Index() {
  if (typeof window !== 'undefined') {
    // ホーム画面1ページ目にリダイレクト
    window.location.href = '/home/page/1';
  }
  return null;
}
