export default function EpisodesIndex() {
  if (typeof window !== 'undefined') {
    // エピソードカテゴリ一覧にリダイレクト
    window.location.href = '/episodes/categories';
  }
  return null;
}
