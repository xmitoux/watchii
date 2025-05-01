import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { CloseButton, Drawer, Flex, Icon, Portal } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { useColorMode } from '@repo/ui/chakra-ui/color-mode';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';
import { IoHeart, IoHeartOutline, MdDarkMode, MdExitToApp, MdInfoOutline, MdMenu, MdOutlineLightMode, MdSmartphone } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import { usePWAInstallGuide } from '@/features/Home/hooks/usePWAInstallGuide';

/** メニュードロワー */
export function MenuDrawer() {
  const router = useRouter();
  const supabase = createClient();

  const [showMenu, setShowMenu] = useState(false);

  const { isPWA } = usePWAInstallGuide();

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

  return (
    <>
      <Drawer.Root open={showMenu} onOpenChange={(e) => setShowMenu(e.open)}>
        <Drawer.Trigger asChild>
          <Button variant="plain" color="chiiWhite">
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
                  <MenuButton
                    icon={colorMode === 'light' ? <IoHeartOutline /> : <IoHeart />}
                    label="お気に入り一覧"
                    to="/favs"
                  />

                  <MenuButton
                    icon={colorMode === 'light' ? <MdOutlineLightMode /> : <MdDarkMode />}
                    label="ダークモード切り替え"
                    onClick={handleToggleDarkMode}
                  />

                  {!isPWA() && (
                    <MenuButton
                      icon={<MdSmartphone />}
                      label="インストールガイド"
                      onClick={() => router.push('/pwa-install-guide')}
                    />
                  )}
                </Flex>
              </Drawer.Body>

              <Drawer.Footer flexDirection="column" justifyContent="center" gap={0}>
                <MenuButton
                  icon={<MdInfoOutline />}
                  label="このアプリについて"
                  onClick={() => router.push('/about')}
                />

                <MenuButton
                  icon={<MdExitToApp />}
                  label="ログアウト"
                  labelColor="red.400"
                  onClick={handleLogout}
                />
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

type MenuButtonProps = {
  icon: React.ReactNode;
  label: string;
  labelColor?: string;
  to?: string;
  onClick?: () => void;
};

function MenuButton({ icon, label, labelColor, to, onClick }: MenuButtonProps) {
  return (
    <Button variant="ghost" width="full" color={labelColor} onClick={onClick}>
      <Icon>
        {icon}
      </Icon>
      {to
        ? (
          <Link href={to} passHref>
            {label}
          </Link>
        )
        : label}
    </Button>
  );
}
