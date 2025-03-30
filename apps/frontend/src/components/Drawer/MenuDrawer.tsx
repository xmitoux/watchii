import { useRouter } from 'next/router';

import { CloseButton, Drawer, Flex, Icon, Portal } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';
import { MdExitToApp, MdMenu, MdSmartphone } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

/** メニュードロワー */
export function MenuDrawer() {
  const router = useRouter();
  const supabase = createClient();

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
      <Drawer.Root>
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
                <Flex direction="column" gap={0}>
                  <Button variant="ghost" width="full">
                    <MdSmartphone />
                    インストールガイド
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
