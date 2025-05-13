// pages/signup.tsx
import { motion } from 'motion/react';
import React, { useState } from 'react';

import { Center, Container, Field, Fieldset, Icon, Input, Stack } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { MdMail } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import MessageWithImage from '@/components/MessageWithImage';
import { PasswordFields } from '@/components/PasswordFields';
import PrefetchImage from '@/components/PrefetchImage';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { useToast } from '@/hooks/useToast';

export default function Signup() {
  const supabase = createClient();
  const { showErrorToast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

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
    isFormValid: isPasswordValid,
  } = usePasswordValidation();

  // フォーム全体の有効性
  const isFormValid = email !== '' && isPasswordValid;

  /** サインアップ処理 */
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (email === '') {
        throw new Error('メールアドレスを入力してください');
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

      // Supabaseでサインアップ処理
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw error;
      }

      setSignUpSuccess(true);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: '登録に失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="新規登録" canBack noFooter noMenu>
      <Container maxW="xl">

        <Center>
          {signUpSuccess
            ? (
              <motion.div
                key="completed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <MessageWithImage
                  title="登録確認用のメールを送信しました！"
                  messages={['メール内のリンクをクリックして', '登録を完了してください！']}
                  imageSrc="/images/signup-mail-sent.webp"
                />
              </motion.div>
            )
            : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3, ease: 'easeIn' } }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <form onSubmit={handleSignup}>
                  <Fieldset.Root size="lg">
                    <Stack>
                      <Fieldset.Legend>登録</Fieldset.Legend>
                      <Fieldset.HelperText>アカウント情報を入力してね！</Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                      <Field.Root required>
                        <Field.Label>
                          <Icon><MdMail /></Icon>
                          メールアドレス
                          <Field.RequiredIndicator />
                        </Field.Label>

                        <Input
                          value={email}
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Field.Root>

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
                        登録
                      </BasicButton>
                    </Center>
                  </Fieldset.Root>
                </form>
              </motion.div>
            )}
        </Center>
      </Container>

      {/* 画像プリフェッチ用の隠し要素 */}
      <PrefetchImage src="/images/signup-mail-sent.webp" width={1000} />
    </Layout>
  );
}
