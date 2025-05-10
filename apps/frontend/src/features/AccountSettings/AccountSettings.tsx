import { useRouter } from 'next/router';
import { useState } from 'react';

import { Card, Center, CloseButton, Container, Dialog, Flex, HStack, Icon, Portal, Stack, Text } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { MdLockReset, MdNoAccounts } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';
import { usersApi } from '@/features/Signup/api/users-api';
import { useSessionToken } from '@/hooks/useSessionToken';
import { useToast } from '@/hooks/useToast';
import { gotoLogoutedPageAndRestHistory } from '@/utils/gotoLogoutedPageAndRestHistory';

export default function AccountSettings() {
  const router = useRouter();
  const { showErrorToast } = useToast();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function gotoResetPasswordPage() {
    router.push('/update-password');
  }

  const { getSessionToken } = useSessionToken();
  const [loadingUserDelete, setLoadingUserDelete] = useState(false);

  /** 退会処理 */
  async function handleUserDelete() {
    setLoadingUserDelete(true);

    try {
      const token = await getSessionToken();
      if (!token) {
        return;
      }

      // ユーザ削除API
      await usersApi.deleteUser(token);

      gotoLogoutedPageAndRestHistory('/goodbye');
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
    <Layout title="アカウント設定" canBack noFooter noMenu>
      <Center>
        <Container maxW="xl">
          <Stack gap={4}>
            <Stack>
              <Text fontSize="lg">アカウント設定</Text>
              <Text fontSize="sm" color="gray.500">各種アカウント設定を行います</Text>
            </Stack>

            <Card.Root>
              <Card.Body p={4}>
                <Stack gap={8}>
                  <Flex direction={{ base: 'column', md: 'row' }} gap={4} justify="space-between">
                    <Stack>
                      <HStack gap={1}>
                        <Icon size="md"><MdLockReset /></Icon>
                        <Text>パスワード変更</Text>
                      </HStack>

                      <Text fontSize="xs" color="gray.500">パスワード変更手続きを行います</Text>
                    </Stack>

                    <Center>
                      <BasicButton color="chiiWhite" bg="hachiBlueSwitch" w="150px" onClick={gotoResetPasswordPage}>
                        変更する
                      </BasicButton>
                    </Center>
                  </Flex>

                  <Flex direction={{ base: 'column', md: 'row' }} gap={4} justify="space-between">
                    <Stack>
                      <HStack gap={1}>
                        <Icon size="md"><MdNoAccounts /></Icon>
                        <Text>退会</Text>
                      </HStack>

                      <Text fontSize="xs" color="gray.500">アカウントを削除し、Watchiiの利用を終了します</Text>
                    </Stack>

                    <Center>
                      <BasicButton colorPalette="red" w="150px" onClick={() => setShowDeleteDialog(true)}>
                        退会する
                      </BasicButton>
                    </Center>
                  </Flex>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Stack>
        </Container>
      </Center>

      {/* 退会確認ダイアログ */}
      <UserDeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        loading={loadingUserDelete}
        onDelete={handleUserDelete}
      />
    </Layout>
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
