export default function EpisodeCategoryIndex() {
  if (typeof window !== 'undefined') {
    // 当該カテゴリの最初のページにリダイレクト
    window.location.href = `${window.location.href}/page/1`;
  }
  return null;
}
