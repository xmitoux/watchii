export default function TagPostsIndex() {
  if (typeof window !== 'undefined') {
    // 当該タグの最初のページにリダイレクト
    window.location.href = `${window.location.href}/page/1`;
  }
  return null;
}
