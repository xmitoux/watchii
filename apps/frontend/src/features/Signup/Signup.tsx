import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { Center, Field, Fieldset, Icon, Input, Stack, Text } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { PasswordInput } from '@repo/ui/chakra-ui/password-input';
import { IoCheckmarkCircle, IoCloseCircle, MdLock, MdMail } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import MessageWithImage from '@/components/MessageWithImage';
import PrefetchImage from '@/components/PrefetchImage';
import { useToast } from '@/hooks/useToast';

// パスワード検証関数
const isValidPassword = (password: string): boolean => {
  // 半角英数字のみかチェック// 半角英数字と記号を許可する正規表現
  return /^[a-zA-Z0-9!@#$%^&*()_+\-=~\[\]{};':"\\|,.<>\/?]+$/.test(password);
};

export default function Signup() {
  const supabase = createClient();
  const { showErrorToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // バリデーション状態
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [isAlphaNum, setIsAlphaNum] = useState(true);

  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // パスワードのバリデーション
  useEffect(() => {
    if (password) {
      setIsAlphaNum(isValidPassword(password));
    }
  }, [password]);

  // パスワードの一致をチェック（onBlurと入力中）
  const handleConfirmBlur = () => {
    setConfirmTouched(true);
    setPasswordsMatch(password === confirmPassword && confirmPassword.length > 0);
  };

  // パスワードのブラーイベント
  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  // 確認用パスワードの変更時
  const handleConfirmChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newValue = (e.target as HTMLInputElement).value;
    setConfirmPassword(newValue);

    // すでにタッチされている場合のみリアルタイムでチェック
    if (confirmTouched) {
      setPasswordsMatch(password === newValue && newValue.length > 0);
    }
  };

  // パスワード変更時のチェック関数
  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newPassword = (e.target as HTMLInputElement).value;
    setPassword(newPassword);

    // 半角英数字チェック
    setIsAlphaNum(isValidPassword(newPassword));

    // すでに確認用がタッチされていたら再検証
    if (confirmTouched && confirmPassword.length > 0) {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  };

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

      if (!isValidPassword(password)) {
        throw new Error('パスワードは半角英数字のみで入力してください');
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

                    <Field.Root required invalid={passwordTouched && password !== '' && (!isAlphaNum || password.length < 8)}>
                      <Field.Label>
                        <Icon><MdLock /></Icon>
                        パスワード
                        <Field.RequiredIndicator />
                      </Field.Label>

                      <PasswordInput
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordBlur}
                      />

                      <Field.HelperText>
                        ※8文字以上の半角英数字記号が使用できます
                      </Field.HelperText>

                      {passwordTouched && !isAlphaNum && (
                        <Field.ErrorText display="flex" alignItems="center" gap={0}>
                          <Icon size="sm" mr={1}>
                            <IoCloseCircle />
                          </Icon>
                          <Text pb="1px">半角英数字記号のみ使用できます</Text>
                        </Field.ErrorText>
                      )}

                      {passwordTouched && password.length > 0 && password.length < 8 && (
                        <Field.ErrorText display="flex" alignItems="center" gap={0}>
                          <Icon size="sm" mr={1}>
                            <IoCloseCircle />
                          </Icon>
                          <Text pb="1px">8文字以上入力してください</Text>
                        </Field.ErrorText>
                      )}

                      {(password.length >= 8 && isAlphaNum && password.length > 0) && (
                        <Field.HelperText color="green.500" display="flex" alignItems="center">
                          <Icon size="sm" mr={1}>
                            <IoCheckmarkCircle />
                          </Icon>
                          <Text pb="1px">OK!</Text>
                        </Field.HelperText>
                      )}
                    </Field.Root>

                    <Field.Root
                      required
                      invalid={confirmTouched && !passwordsMatch && confirmPassword !== ''}
                    >
                      <Field.Label>
                        <Icon><MdLock /></Icon>
                        パスワード（確認用）
                        <Field.RequiredIndicator />
                      </Field.Label>

                      <PasswordInput
                        value={confirmPassword}
                        onChange={handleConfirmChange}
                        onBlur={handleConfirmBlur}
                      />

                      {confirmTouched && !passwordsMatch && confirmPassword !== '' && (
                        <Field.ErrorText display="flex" alignItems="center" gap={0}>
                          <Icon size="sm" mr={1}>
                            <IoCloseCircle />
                          </Icon>
                          <Text pb="1px">確認用パスワードが一致しません</Text>
                        </Field.ErrorText>
                      )}

                      {passwordsMatch && (
                        <Field.HelperText color="green.500" display="flex" alignItems="center">
                          <Icon size="sm" mr={1}>
                            <IoCheckmarkCircle />
                          </Icon>
                          <Text pb="1px">OK!</Text>
                        </Field.HelperText>
                      )}
                    </Field.Root>
                  </Fieldset.Content>

                  <Button
                    color="chiiWhite"
                    bg="hachiBlue"
                    type="submit"
                    disabled={
                      email === ''
                      || password === ''
                      || confirmPassword === ''
                      || !passwordsMatch
                      || password.length < 8
                      || !isAlphaNum
                    }
                    loading={loading}
                  >
                    登録
                  </Button>
                </Fieldset.Root>
              </form>
            </motion.div>
          )}
      </Center>

      {/* 画像プリフェッチ用の隠し要素 */}
      <PrefetchImage src="/images/signup-mail-sent.webp" width={1000} />
    </Layout>
  );
}
