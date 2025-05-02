import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { Center } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { createClient } from '@repo/ui/utils';

import Layout from '@/components/Layout/Layout';
import { usersApi } from '@/features/Signup/api/users-api';

export default function SignupConfirm() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  /** 登録確認処理 */
  async function handleConfirm() {
    const token_hash = router.query.token_hash as string;

    if (token_hash) {
      setLoading(true);

      try {
        // ユーザ登録API
        const { session } = await usersApi.registerUser({ token: token_hash });

        // 登録結果のセッションを保存してログイン
        const { error } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        if (error) {
          console.error('Error setting session:', error);
          return;
        }

        router.push('/');
      }
      catch (error) {
        console.error('Error confirming signup:', error);
      }
      finally {
        setLoading(false);
      }
    }
  }

  return (
    <Layout title="登録確認" noFooter noMenu>
      <Center>
        <Button color="chiiWhite" bg="hachiBlue" loading={loading} onClick={handleConfirm}>
          確認
        </Button>
      </Center>
    </Layout>
  );
}
