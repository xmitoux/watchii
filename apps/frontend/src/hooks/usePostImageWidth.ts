import { useDeviceTypeStore } from '@/stores/deviceTypeStore';

/** 画面サイズに基づいてPost画像の幅を返すカスタムフック */
export const usePostImageWidth = () => {
  const {
    isMobile,
    isTablet,
  } = useDeviceTypeStore();

  const getImageWidth = () => {
    if (isMobile) {
      return '80vw';
    }
    if (isTablet) {
      return '80vw';
    }

    return '25vw';
  };

  return getImageWidth();
};
