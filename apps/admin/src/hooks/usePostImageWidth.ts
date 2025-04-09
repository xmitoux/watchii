import { useDeviceType } from '@repo/ui/hooks';

type UsePostImageWidthProps = {
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;
};

/** 画面サイズに基づいてPost画像の幅を返すカスタムフック */
export const usePostImageWidth = (props: UsePostImageWidthProps = {}) => {
  const {
    mobileWidth = '80vw',
    tabletWidth = '70vw',
    desktopWidth = '50vh',
  } = props;

  const { isMobile, isTablet } = useDeviceType();

  const getImageWidth = () => {
    if (isMobile) {
      return mobileWidth;
    }
    if (isTablet) {
      return tabletWidth;
    }

    return desktopWidth;
  };

  return getImageWidth();
};
