// hooks/usePasswordValidation.tsx
import { useEffect, useState } from 'react';

// パスワード検証関数
const isValidPassword = (password: string): boolean => {
  // 半角英数字と記号を許可する正規表現
  return /^[a-zA-Z0-9!@#$%^&*()_+\-=~\[\]{};':"\\|,.<>\/?]+$/.test(password);
};

// インターフェイス定義
type UsePasswordValidationProps = {
  minLength?: number;
  validateOnChange?: boolean;
};

type UsePasswordValidationReturn = {
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
  isFormValid: boolean;
};

/**
 * パスワードバリデーション用カスタムフック
 */
export const usePasswordValidation = (props?: UsePasswordValidationProps): UsePasswordValidationReturn => {
  // デフォルト値
  const minLength = props?.minLength || 8;
  const validateOnChange = props?.validateOnChange || false;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // バリデーション状態
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [isValidFormat, setIsValidFormat] = useState(true);
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // パスワードのバリデーション
  useEffect(() => {
    if (password) {
      setIsValidFormat(isValidPassword(password));
      setIsLongEnough(password.length >= minLength);
    }
    else {
      setIsValidFormat(true);
      setIsLongEnough(false);
    }

    // 確認用と一致するかチェック
    if (confirmTouched && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword, confirmTouched, minLength]);

  // パスワードの一致をチェック
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

    // リアルタイムでチェックするか、すでにタッチされている場合のみチェック
    if (validateOnChange || confirmTouched) {
      setPasswordsMatch(password === newValue && newValue.length > 0);
    }
  };

  // パスワード変更時のチェック関数
  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newPassword = (e.target as HTMLInputElement).value;
    setPassword(newPassword);

    // バリデーション（リアルタイムかすでにタッチ済みの場合）
    if (validateOnChange || passwordTouched) {
      setIsValidFormat(isValidPassword(newPassword));
      setIsLongEnough(newPassword.length >= minLength);
    }

    // 確認用とのマッチングチェック
    if ((validateOnChange || confirmTouched) && confirmPassword.length > 0) {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  };

  // フォーム全体の有効性
  const isFormValid = password.length > 0
    && confirmPassword.length > 0
    && isValidFormat
    && isLongEnough
    && passwordsMatch;

  return {
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
  };
};
