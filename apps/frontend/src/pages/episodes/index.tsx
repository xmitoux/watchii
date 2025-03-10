export default function EpisodesIndex() {
  if (typeof window !== 'undefined') {
    // エピソード一覧1ページ目にリダイレクト
    window.location.href = '/episodes/page/1';
  }
  return null;
}
