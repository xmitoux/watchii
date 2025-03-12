import { useDeviceType } from '@repo/ui/hooks';

/** 画面サイズに基づいてPost画像の幅を返すカスタムフック */
export const usePostImageWidth = () => {
  const {
    isMobile,
    isTablet,
  } = useDeviceType();

  const getImageWidth = () => {
    if (isMobile) { return '90vw'; }
    if (isTablet) { return '80vw'; }
    return '25vw';
  };

  return getImageWidth();
};
