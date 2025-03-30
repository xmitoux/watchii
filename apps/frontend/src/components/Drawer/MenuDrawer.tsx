import { useRouter } from 'next/router';
import { useState } from 'react';

import { CloseButton, Drawer, Flex, Icon, Portal } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';
import { MdExitToApp, MdMenu, MdSmartphone } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import { usePWAInstallGuide } from '@/features/Home/hooks/usePWAInstallGuide';
import { useSettingStore } from '@/stores/settingStore';

/** メニュードロワー */
export function MenuDrawer() {
  const router = useRouter();
  const supabase = createClient();

  const [showMenu, setShowMenu] = useState(false);

  const { isPWA } = usePWAInstallGuide();
  const setShowPWAInstallGuide = useSettingStore((state) => state.setShowPWAInstallGuide);

  function handlePWAInstallGuide() {
    // PWAインストールガイドを表示
    setShowPWAInstallGuide(true);
    setShowMenu(false);
  }

  async function handleLogout() {
    try {
      // Supabaseでログアウト処理
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      // ログイン画面にリダイレクト
      router.push('/login');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toaster.create({
        title: 'ログアウトに失敗しました😢',
        description: error.message || 'もう一度試してみてね',
        type: 'error',
        duration: 3000,
      });
    }
    finally {
    }
  }

  return (
    <>
      <Drawer.Root open={showMenu} onOpenChange={(e) => setShowMenu(e.open)}>
        <Drawer.Trigger asChild>
          <Button variant="plain">
            <MdMenu />
          </Button>
        </Drawer.Trigger>

        <Portal>
          <Drawer.Backdrop />

          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>メニュー</Drawer.Title>
              </Drawer.Header>

              <Drawer.Body>
                <Flex direction="column">
                  {!isPWA() && (
                    <Button variant="ghost" width="full" onClick={handlePWAInstallGuide}>
                      <MdSmartphone />
                      インストールガイド
                    </Button>
                  )}
                </Flex>
              </Drawer.Body>

              <Drawer.Footer justifyContent="center">

                <Button variant="ghost" color="red.400" width="full" onClick={handleLogout}>
                  <Icon><MdExitToApp /></Icon>
                  ログアウト
                </Button>
              </Drawer.Footer>

              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      <Toaster />
    </>
  );
}
