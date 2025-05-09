import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { CloseButton, Dialog, Drawer, Flex, Icon, Portal } from '@repo/ui/chakra-ui';
import { useColorMode } from '@repo/ui/chakra-ui/color-mode';
import { BasicButton } from '@repo/ui/components';
import { IoHeart, IoHeartOutline, MdDarkMode, MdExitToApp, MdInfoOutline, MdMenu, MdNoAccounts, MdOutlineLightMode, MdSmartphone } from '@repo/ui/icons';
import { createClient } from '@repo/ui/utils';

import { usePWAInstallGuide } from '@/features/Home/hooks/usePWAInstallGuide';
import { usersApi } from '@/features/Signup/api/users-api';
import { useSessionToken } from '@/hooks/useSessionToken';
import { useToast } from '@/hooks/useToast';
import { useFavsStore } from '@/stores/favsStore';
import { useNavigationStore } from '@/stores/navigationStore';

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

      gotoLogoutedPage('/welcome');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'ログアウトに失敗しました😢',
        errorMessage: error.message,
      });
    }
  }

  /** ログアウト後に表示するページへの移動 */
  function gotoLogoutedPage(destination: string) {
    // ログアウト後にブラウザバックで画面操作ができてしまう問題の対応
    window.history.replaceState(null, '', destination);
    for (let i = 0; i < 10; i++) {
      // 履歴を追加して戻れないようにする
      window.history.pushState(null, '', destination);
    }
    window.location.reload();
  }

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { getSessionToken } = useSessionToken();
  const [loadingUserDelete, setLoadingUserDelete] = useState(false);

  async function handleUserDelete() {
    setLoadingUserDelete(true);

    try {
      const token = await getSessionToken();
      if (!token) {
        return;
      }

      // ユーザ削除API
      await usersApi.deleteUser(token);

      gotoLogoutedPage('/goodbye');
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: '退会に失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setLoadingUserDelete(false);
    }
  }

  return (
    <>
      <Drawer.Root open={showMenu} onOpenChange={(e) => setShowMenu(e.open)}>
        <Drawer.Trigger asChild>
          <BasicButton variant="plain" color="chiiWhite" w="54px">
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
                  onClick={() => setShowDeleteDialog(true)}
                />
              </Drawer.Footer>

              <Drawer.CloseTrigger asChild>
                <CloseButton size="md" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

      {/* 退会確認ダイアログ */}
      <UserDeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        loading={loadingUserDelete}
        onDelete={handleUserDelete}
      />
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
    <BasicButton variant="ghost" width="full" color={labelColor} onClick={onClick}>
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

/** 退会確認ダイアログのProps */
type UserDeleteConfirmDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  loading: boolean;
  onDelete: () => void;
};

/** 退会確認ダイアログ */
function UserDeleteConfirmDialog({ open, onOpenChange, loading, onDelete }: UserDeleteConfirmDialogProps) {
  return (
    <Dialog.Root
      open={open}
      size="xs"
      placement="center"
      closeOnEscape={false}
      closeOnInteractOutside={false}
      onOpenChange={(e) => onOpenChange(e.open)}
    >
      <Portal>
        <Dialog.Backdrop />

        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="xl">退会確認</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body fontSize="md">やめちゃう…ってコト！？</Dialog.Body>

            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <BasicButton variant="outline" width="100px" disabled={loading}>
                  キャンセル
                </BasicButton>
              </Dialog.ActionTrigger>

              <BasicButton width="100px" colorPalette="red" loading={loading} onClick={onDelete}>
                退会する
              </BasicButton>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="md" disabled={loading} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
