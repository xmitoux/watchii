import { useState } from 'react';

import { Center, Flex, Heading, Tabs } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from '@repo/ui/chakra-ui/drawer';
import { useDeviceType } from '@repo/ui/hooks';
import { MdCropPortrait, MdGridView } from '@repo/ui/icons';

/** 表示形式 */
export const DisplayMode = {
  ONE_COLUMN: 'one-column',
  TWO_COLUMN: 'two-column',
} as const;

export type DisplayMode = typeof DisplayMode[keyof typeof DisplayMode];

type DisplaySettingsDrawerProps = {
  /** ドロワーの開閉状態 */
  open: boolean;
  /** 現在の表示形式 */
  displayMode: DisplayMode;
  /** ドロワーの開閉状態が変更された時のコールバック */
  onOpenChange: (open: boolean) => void;
  /** 表示設定が適用された時のコールバック */
  onApplySettings: (settings: { displayMode: DisplayMode }) => void;
};

export const DisplaySettingsDrawer: React.FC<DisplaySettingsDrawerProps> = ({
  open,
  displayMode,
  onOpenChange,
  onApplySettings,
}) => {
  const { isMobile } = useDeviceType();

  // ドロワー内の適用前の表示設定
  const [tempDisplayMode, setTempDisplayMode] = useState<DisplayMode>(displayMode);

  /** ドロワー開閉処理 */
  function handleDrawerOpenClose(open: boolean) {
    if (open) {
      // ドロワーが開いた時に、現在の表示設定を反映
      setTempDisplayMode(displayMode);
    }
    onOpenChange(open);
  }

  /**  表示設定適用処理 */
  function handleApplySettings() {
    onApplySettings({
      displayMode: tempDisplayMode,
    });

    onOpenChange(false);
  }

  return (
    <DrawerRoot open={open} onOpenChange={e => handleDrawerOpenClose(e.open)}>
      <DrawerBackdrop />

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>表示設定</DrawerTitle>
        </DrawerHeader>

        <DrawerBody>
          <Flex direction="column" gap={3}>
            {isMobile && (
              <>
                <Heading size="sm">画像の表示形式</Heading>
                <Center>
                  <Tabs.Root
                    value={tempDisplayMode}
                    defaultValue={DisplayMode.ONE_COLUMN}
                    variant="plain"
                    onValueChange={({ value }) => setTempDisplayMode(value as DisplayMode)}
                  >
                    <Tabs.List bg="bg.muted" rounded="l3" p="1">
                      <Tabs.Trigger value={DisplayMode.ONE_COLUMN}>
                        <MdCropPortrait />
                        1列表示
                      </Tabs.Trigger>
                      <Tabs.Trigger value={DisplayMode.TWO_COLUMN}>
                        <MdGridView />
                        2列表示
                      </Tabs.Trigger>
                      <Tabs.Indicator rounded="l2" />
                    </Tabs.List>
                  </Tabs.Root>
                </Center>
              </>
            )}
          </Flex>
        </DrawerBody>

        <DrawerFooter>
          <DrawerActionTrigger asChild>
            <Button variant="outline">キャンセル</Button>
          </DrawerActionTrigger>
          <Button onClick={handleApplySettings}>適用</Button>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};
