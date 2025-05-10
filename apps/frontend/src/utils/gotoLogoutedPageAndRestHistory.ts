/** ログアウト後に表示するページへの移動とブラウザ履歴のリセット */
export function gotoLogoutedPageAndRestHistory(destination: string) {
  // ログアウト後にブラウザバックで画面操作ができてしまう問題の対応
  window.history.replaceState(null, '', destination);
  for (let i = 0; i < 10; i++) {
    // 履歴を追加して戻れないようにする
    window.history.pushState(null, '', destination);
  }
  window.location.reload();
}
