import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { CloseButton, Drawer, Flex, Icon, Portal } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { useColorMode } from '@repo/ui/chakra-ui/color-mode';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';
import { IoHeart, IoHeartOutline, MdDarkMode, MdExitToApp, MdInfoOutline, MdMenu, MdNoAccounts, MdOutlineLightMode, MdSmartphone } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import { usePWAInstallGuide } from '@/features/Home/hooks/usePWAInstallGuide';
import { usersApi } from '@/features/Signup/api/users-api';
import { useSessionToken } from '@/hooks/useSessionToken';
import { useFavsStore } from '@/stores/favsStore';
import { useNavigationStore } from '@/stores/navigationStore';

const favsPath = '/favs/page/1';

/** メニュードロワー */
export function MenuDrawer() {
  const router = useRouter();
  const supabase = createClient();

  const [showMenu, setShowMenu] = useState(false);

  const store = useFavsStore();
  const favsNavStoreReset = useNavigationStore('favs', (state) => state.reset);

  function handleGotoFavs() {
    // お気に入り一覧から戻るためのパスをストアに保存
    store.setPrePagePath(router.asPath);
    // お気に入り一覧のスクロール位置をリセット
    favsNavStoreReset();
    router.push(favsPath);
  }

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

      gotoWelcomePage();
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
  }

  function gotoWelcomePage() {
    // ログアウト後にブラウザバックで画面操作ができてしまう問題の対応
    window.history.replaceState(null, '', '/welcome');
    for (let i = 0; i < 10; i++) {
      // 履歴を追加して戻れないようにする
      window.history.pushState(null, '', '/welcome');
    }
    window.location.reload();
  }

  const { getSessionToken } = useSessionToken();

  async function handleUserDelete() {
    try {
      const token = await getSessionToken();
      if (!token) {
        return;
      }

      // ユーザ削除API
      await usersApi.deleteUser(token);

      gotoWelcomePage();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      toaster.create({
        title: '退会に失敗しました😢',
        description: error.message || 'もう一度試してみてね',
        type: 'error',
        duration: 3000,
      });
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
                    to={favsPath}
                    onClick={handleGotoFavs}
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
                      to="/pwa-install-guide"
                    />
                  )}
                </Flex>
              </Drawer.Body>

              <Drawer.Footer flexDirection="column" justifyContent="center" gap={0} mb="20px">
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

                <MenuButton
                  icon={<MdNoAccounts />}
                  label="退会する"
                  labelColor="red.400"
                  onClick={handleUserDelete}
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
