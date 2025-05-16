import { Login as BaseLogin } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';

import { usersApi } from './api/users-api';

export default function Login() {
  async function verifyAdminUser(token: string): Promise<void> {
    await usersApi.verifyAdminUser(token);
  }

  return (
    <Layout title="Watchii Adminにログイン" noFooter noMenu>
      <BaseLogin homeUrl="/posts" onVerifyAdminUser={verifyAdminUser} />
    </Layout>
  );
}
