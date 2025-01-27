import { useBreakpointValue } from '@repo/ui/chakra-ui';

/**
 * デバイスタイプを判定するカスタムフック
 * @returns デバイスタイプに関する情報を含むオブジェクト
 */
export const useDeviceType = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return {
    /** モバイルデバイス（スマートフォン・タブレット）か */
    isMobile,
    /** タブレットか */
    isTablet,
    /** デスクトップか */
    isDesktop,
    /** 現在のデバイスタイプ */
    deviceType: isDesktop ? 'desktop' : (isTablet ? 'tablet' : 'mobile'),
  } as const;
};

// 使用例
/*
const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, deviceType } = useDeviceType();

  return (
    <div>
      {isMobile && <div>モバイル向けUI</div>}
      {isTablet && <div>タブレット向けUI</div>}
      {isDesktop && <div>デスクトップ向けUI</div>}

      <div>現在のデバイス: {deviceType}</div>
    </div>
  );
};
*/
