import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { CloseButton, Drawer, Flex, Icon, Portal } from '@repo/ui/chakra-ui';
import { useColorMode } from '@repo/ui/chakra-ui/color-mode';
import { BasicButton } from '@repo/ui/components';
import {
  IoDocumentText,
  IoDocumentTextOutline,
  IoHeart,
  IoHeartOutline,
  IoReload,
  MdAccountCircle,
  MdInstallMobile,
  MdLightMode,
  MdLogout,
  MdMenu,
  MdOutlineAccountCircle,
  MdOutlineDarkMode,
  MdOutlineInstallMobile,
  MdOutlinePrivacyTip,
  MdPrivacyTip,
} from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import { useToast } from '@/hooks/useToast';
import { useDeviceTypeStore } from '@/stores/deviceTypeStore';
import { useFavsStore } from '@/stores/favsStore';
import { useNavigationStore } from '@/stores/navigationStore';
import { gotoLogoutedPageAndRestHistory } from '@/utils/gotoLogoutedPageAndRestHistory';

const favsPath = '/favs/page/1';

/** メニュードロワー */
export function MenuDrawer() {
  const router = useRouter();
  const supabase = createClient();
  const { showErrorToast } = useToast();

  const [showMenu, setShowMenu] = useState(false);

  const store = useFavsStore();
  const favsNavStoreReset = useNavigationStore('favs', (state) => state.reset);

  function handleGotoFavs() {
    setShowMenu(false);

    // お気に入り一覧から戻るためのパスをストアに保存
    store.setPrePagePath(router.asPath);
    // お気に入り一覧のスクロール位置をリセット
    favsNavStoreReset();
    router.push(favsPath);
  }

  const { isPWA } = useDeviceTypeStore();

  const { toggleColorMode, colorMode } = useColorMode();

  function handleToggleDarkMode() {
    // ダークモードのトグル
    toggleColorMode();
    setShowMenu(false);
  }

  // リロードボタンの処理
  function handleReload() {
    setShowMenu(false);

    window.location.reload();
  }

  async function handleLogout() {
    setShowMenu(false);

    try {
      // Supabaseでログアウト処理
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      gotoLogoutedPageAndRestHistory('/welcome');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'ログアウトに失敗しました😢',
        errorMessage: error.message,
      });
    }
  }

  return (
    <>
      <Drawer.Root open={showMenu} onOpenChange={(e) => setShowMenu(e.open)}>
        <Drawer.Trigger asChild>
          <BasicButton
            variant="plain"
            color="chiiWhite"
            w="50px"
            tapScale={0.9}
            onClick={(e) => e.stopPropagation()} // ヘッダータップスクロールが発火しないようにする
          >
            <MdMenu />
          </BasicButton>
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
                    icon={colorMode === 'light' ? <MdOutlineDarkMode /> : <MdLightMode />}
                    label={colorMode === 'light' ? 'ダークモード' : 'ライトモード'}
                    onClick={handleToggleDarkMode}
                  />

                  <MenuButton
                    icon={colorMode === 'light' ? <MdOutlineAccountCircle /> : <MdAccountCircle />}
                    label="アカウント設定"
                    to="/account-settings"
                    onClick={() => setShowMenu(false)}
                  />

                  <MenuButton icon={<IoReload />} label="ページリロード" onClick={handleReload} />
                </Flex>
              </Drawer.Body>

              <Drawer.Footer flexDirection="column" justifyContent="center" gap={0} mb="20px">
                {!isPWA && (
                  <MenuButton
                    icon={colorMode === 'light' ? <MdOutlineInstallMobile /> : <MdInstallMobile />}
                    label="インストールガイド"
                    to="/pwa-install-guide"
                    onClick={() => setShowMenu(false)}
                  />
                )}

                <MenuButton
                  icon={colorMode === 'light' ? <IoDocumentTextOutline /> : <IoDocumentText />}
                  label="利用規約"
                  to="/about/terms-of-use"
                  onClick={() => setShowMenu(false)}
                />

                <MenuButton
                  icon={colorMode === 'light' ? <MdOutlinePrivacyTip /> : <MdPrivacyTip />}
                  label="プライバシーポリシー"
                  to="/about/privacy-policy"
                  onClick={() => setShowMenu(false)}
                />

                <MenuButton
                  icon={<MdLogout />}
                  label="ログアウト"
                  labelColor="red.400"
                  onClick={handleLogout}
                />
              </Drawer.Footer>

              <Drawer.CloseTrigger asChild>
                <CloseButton size="md" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
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
    <BasicButton
      variant="ghost"
      width="full"
      color={labelColor}
      onClick={(e) => {
        // メニュー選択後にヘッダータップスクロールがなぜか発火するのでstop
        e.stopPropagation();
        onClick?.();
      }}
    >
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
    </BasicButton>
  );
}
