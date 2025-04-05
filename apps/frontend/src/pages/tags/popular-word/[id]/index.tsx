export default function PopularWordPostsIndex() {
  if (typeof window !== 'undefined') {
    // 当該語録の最初のページにリダイレクト
    window.location.href = `${window.location.href}/page/1`;
  }
  return null;
}
