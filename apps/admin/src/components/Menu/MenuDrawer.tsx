import { useRouter } from 'next/router';
import { useState } from 'react';

import { CloseButton, Drawer, Flex, Icon, Portal } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { useColorMode } from '@repo/ui/chakra-ui/color-mode';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';
import { IoReload, MdDarkMode, MdExitToApp, MdMenu, MdOutlineLightMode } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

/** メニュードロワー */
export function MenuDrawer() {
  const router = useRouter();
  const supabase = createClient();

  const [showMenu, setShowMenu] = useState(false);

  const { toggleColorMode, colorMode } = useColorMode();

  function handleToggleDarkMode() {
    // ダークモードのトグル
    toggleColorMode();
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

  function handleReloadPage() {
    window.location.reload();
  }

  return (
    <>
      <Drawer.Root open={showMenu} onOpenChange={(e) => setShowMenu(e.open)}>
        <Drawer.Trigger asChild>
          <Button
            variant="plain"
            color="chiiWhite"
            onClick={(e) => e.stopPropagation()} // ヘッダータップスクロールが発火しないようにする
          >
            <MdMenu />
          </Button>
        </Drawer.Trigger>

        <Portal>
          <Drawer.Backdrop />

          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title color="blackSwitch">メニュー</Drawer.Title>
              </Drawer.Header>

              <Drawer.Body>
                <Flex direction="column">
                  <Button variant="ghost" width="full" onClick={handleToggleDarkMode}>
                    {colorMode === 'light' ? <MdOutlineLightMode /> : <MdDarkMode />}
                    ダークモード切り替え
                  </Button>
                  <Button variant="ghost" width="full" onClick={handleReloadPage}>
                    <IoReload />
                    ページリロード
                  </Button>
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
