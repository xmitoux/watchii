import ResetPassword from '@/features/ResetPassword/ResetPassword';

/** パスワード変更ページ */
export default function UpdatePasswordPage() {
  // パスワードリセット(忘れたときの機能)ページを再利用するが、OTPの検証は行わない
  return <ResetPassword skipOtpVerify={true} />;
}
