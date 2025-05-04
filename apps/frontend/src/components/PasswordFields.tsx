// components/PasswordFields.tsx
import React from 'react';

import { Field, Icon, Text } from '@repo/ui/chakra-ui';
import { PasswordInput } from '@repo/ui/chakra-ui/password-input';
import { IoCheckmarkCircle, IoCloseCircle, MdLock } from '@repo/ui/icons';

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  passwordTouched: boolean;
  confirmTouched: boolean;
  isValidFormat: boolean;
  isLongEnough: boolean;
  passwordsMatch: boolean;
  handlePasswordChange: (e: React.FormEvent<HTMLInputElement>) => void;
  handleConfirmChange: (e: React.FormEvent<HTMLInputElement>) => void;
  handlePasswordBlur: () => void;
  handleConfirmBlur: () => void;
  showPasswordStrength?: boolean;
}

/**
 * パスワード入力用の共通コンポーネント
 */
export const PasswordFields: React.FC<PasswordFieldsProps> = ({
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
}) => {
  const isPasswordValid = isValidFormat && isLongEnough && password.length > 0;

  return (
    <>
      {/* パスワード入力フィールド */}
      <Field.Root required invalid={passwordTouched && password !== '' && (!isValidFormat || !isLongEnough)}>
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

        {passwordTouched && !isValidFormat && password !== '' && (
          <Field.ErrorText display="flex" alignItems="center" gap={0}>
            <Icon size="sm" mr={1}>
              <IoCloseCircle />
            </Icon>
            <Text pb="1px">半角英数字記号のみ使用できます</Text>
          </Field.ErrorText>
        )}

        {passwordTouched && !isLongEnough && password.length > 0 && (
          <Field.ErrorText display="flex" alignItems="center" gap={0}>
            <Icon size="sm" mr={1}>
              <IoCloseCircle />
            </Icon>
            <Text pb="1px">8文字以上入力してください</Text>
          </Field.ErrorText>
        )}

        {isPasswordValid && (
          <Field.HelperText color="green.500" display="flex" alignItems="center">
            <Icon size="sm" mr={1}>
              <IoCheckmarkCircle />
            </Icon>
            <Text pb="1px">OK!</Text>
          </Field.HelperText>
        )}
      </Field.Root>

      {/* 確認用パスワード入力フィールド */}
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

        {passwordsMatch && confirmPassword !== '' && (
          <Field.HelperText color="green.500" display="flex" alignItems="center">
            <Icon size="sm" mr={1}>
              <IoCheckmarkCircle />
            </Icon>
            <Text pb="1px">OK!</Text>
          </Field.HelperText>
        )}
      </Field.Root>
    </>
  );
};
