import { Login as BaseLogin } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';

export default function Login() {
  return (
    <Layout title="Watchiiへようこそ！" noFooter noMenu>
      <BaseLogin />
    </Layout>
  );
}
