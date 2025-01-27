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
import { MdCropPortrait, MdGridView, MdOutlineFiberNew } from '@repo/ui/icons';

import { useDeviceType } from '@/hooks/useDeviceType';

/** 表示順 */
export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = typeof SortOrder[keyof typeof SortOrder];

/** 表示形式 */
export const DisplayMode = {
  ONE_COLUMN: 'one-column',
  TWO_COLUMN: 'two-column',
} as const;

export type DisplayMode = typeof DisplayMode[keyof typeof DisplayMode];

type DisplaySettingsDrawerProps = {
  /** ドロワーの開閉状態 */
  open: boolean;
  /** 現在の並び順 */
  sortOrder: SortOrder;
  /** 現在の表示形式 */
  displayMode: DisplayMode;
  /** ドロワーの開閉状態が変更された時のコールバック */
  onOpenChange: (open: boolean) => void;
  /** 表示設定が適用された時のコールバック */
  onApplySettings: (settings: { sortOrder: SortOrder; displayMode: DisplayMode }) => void;
};

export const DisplaySettingsDrawer: React.FC<DisplaySettingsDrawerProps> = ({
  open,
  sortOrder,
  displayMode,
  onOpenChange,
  onApplySettings,
}) => {
  const { isMobile } = useDeviceType();

  // ドロワー内の適用前の表示設定
  const [tempSortOrder, setTempSortOrder] = useState<SortOrder>(sortOrder);
  const [tempDisplayMode, setTempDisplayMode] = useState<DisplayMode>(displayMode);

  /** ドロワー開閉処理 */
  function handleDrawerOpenClose(open: boolean) {
    if (open) {
      // ドロワーが開いた時に、現在の表示設定を反映
      setTempSortOrder(sortOrder);
      setTempDisplayMode(displayMode);
    }
    onOpenChange(open);
  }

  /**  表示設定適用処理 */
  function handleApplySettings() {
    onApplySettings({
      sortOrder: tempSortOrder,
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
            <Heading size="sm">画像の表示順</Heading>
            <Center>
              <Tabs.Root
                value={tempSortOrder}
                defaultValue={SortOrder.DESC}
                variant="plain"
                onValueChange={({ value }) => setTempSortOrder(value as SortOrder)}
              >
                <Tabs.List bg="bg.muted" rounded="l3" p="1">
                  <Tabs.Trigger value={SortOrder.DESC}>
                    <MdOutlineFiberNew />
                    新着順
                  </Tabs.Trigger>
                  <Tabs.Trigger value={SortOrder.ASC}>
                    古い順
                  </Tabs.Trigger>
                  <Tabs.Indicator rounded="l2" />
                </Tabs.List>
              </Tabs.Root>
            </Center>

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
