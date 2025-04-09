export default function PostsIndex() {
  if (typeof window !== 'undefined') {
    // Post一覧ページにリダイレクト
    window.location.href = '/posts/page/1';
  }
  return null;
}
