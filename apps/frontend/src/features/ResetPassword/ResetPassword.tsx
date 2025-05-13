import { motion } from 'motion/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Center, Fieldset, Flex, Stack } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { createClient } from '@repo/ui/utils';

import RoundedButton from '@/components/Button/RoundedButton';
import Layout from '@/components/Layout/Layout';
import MessageWithImage from '@/components/MessageWithImage';
import { PasswordFields } from '@/components/PasswordFields';
import PrefetchImage from '@/components/PrefetchImage';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useToast } from '@/hooks/useToast';

const supabase = createClient();

type PasswordResetProps = {
  /** ログイン中のパスワード変更の場合はOTP検証不要 */
  skipOtpVerify?: boolean;
};

export default function PasswordReset({ skipOtpVerify }: PasswordResetProps) {
  const router = useRouter();
  const { showErrorToast } = useToast();
  const [canReset, setCanReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);

  // パスワードバリデーションフックを使用
  const {
    password,
    confirmPassword,
    passwordTouched,
    confirmTouched,
    isValidFormat,
    isLongEnough,
    passwordsMatch,
    handlePasswordChange,
    handleConfirmChange,
    handlePasswordBlur,
    handleConfirmBlur,
    isFormValid,
  } = usePasswordValidation({ minLength: 8 });

  useEffect(() => {
    const verifyToken = async () => {
      const token_hash = router.query.token_hash as string;
      if (!token_hash) {
        return;
      }

      // メールのリセットリンクのトークンを検証して認証
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: 'email' });
      if (!data || error) {
        showErrorToast({
          message: 'トークンの検証に失敗しました😢',
          errorMessage: error?.message,
        });

        router.push('/login');
      }

      setCanReset(true);
    };

    if (skipOtpVerify) {
      // ログイン中のパスワード変更の場合はOTP検証不要
      setCanReset(true);
    }
    else {
      verifyToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, skipOtpVerify]);

  /** パスワードリセット処理 */
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (!isFormValid) {
        throw new Error('入力内容を確認してください');
      }

      if (password.length < 8) {
        throw new Error('パスワードは8文字以上で入力してください');
      }

      if (!isValidFormat) {
        throw new Error('パスワードは半角英数字記号のみで入力してください');
      }

      if (password !== confirmPassword) {
        throw new Error('パスワードと確認用パスワードが一致しません');
      }

      // パスワードリセット処理
      const { error: resetPasswordError } = await supabase.auth.updateUser({ password });
      if (resetPasswordError) {
        throw resetPasswordError;
      }

      // ログアウト処理
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }

      setResetPasswordSuccess(true);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'パスワードリセットに失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setLoading(false);
    }
  }

  return (
    canReset
      ? (
        <Layout title="パスワードリセット" canBack noFooter noMenu>
          <Center>
            {resetPasswordSuccess
              ? (
                // パスワードリセット成功画面
                <motion.div
                  key="completed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  <Flex direction="column" justify="center" align="center" minH="75vh">
                    <MessageWithImage
                      title="パスワードがリセットされました！"
                      messages="新しいパスワードでログインしてください"
                      imageSrc="/images/reset-password-completed.webp"
                    />

                    <RoundedButton to="/login" color="chiiWhite" bg="hachiwareBlue.dark">
                      ログイン画面へ
                    </RoundedButton>
                  </Flex>
                </motion.div>
              )
              : (
                // パスワードリセットフォーム
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeIn' } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                >
                  <form onSubmit={handleResetPassword}>
                    <Fieldset.Root size="lg">
                      <Stack>
                        <Fieldset.Legend>パスワードリセット</Fieldset.Legend>
                        <Fieldset.HelperText>新しいパスワードを入力してください</Fieldset.HelperText>
                      </Stack>

                      <Fieldset.Content>
                        {/* 共通パスワードフィールドコンポーネントを使用 */}
                        <PasswordFields
                          password={password}
                          confirmPassword={confirmPassword}
                          passwordTouched={passwordTouched}
                          confirmTouched={confirmTouched}
                          isValidFormat={isValidFormat}
                          isLongEnough={isLongEnough}
                          passwordsMatch={passwordsMatch}
                          handlePasswordChange={handlePasswordChange}
                          handleConfirmChange={handleConfirmChange}
                          handlePasswordBlur={handlePasswordBlur}
                          handleConfirmBlur={handleConfirmBlur}
                        />
                      </Fieldset.Content>

                      <Center>
                        <BasicButton
                          color="chiiWhite"
                          bg="hachiBlue"
                          type="submit"
                          disabled={!isFormValid}
                          loading={loading}
                        >
                          リセットする
                        </BasicButton>
                      </Center>
                    </Fieldset.Root>
                  </form>
                </motion.div>
              )}
          </Center>

          {/* 画像プリフェッチ用の隠し要素 */}
          <PrefetchImage src="/images/reset-password-completed.webp" width={1000} />
        </Layout>
      )
      : null
  );
}
