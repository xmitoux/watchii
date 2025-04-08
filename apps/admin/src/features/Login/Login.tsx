import { Login as BaseLogin } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';

type LoginProps = {
  homeUrl: string;
};

export default function Login({ homeUrl }: LoginProps) {
  return (
    <Layout title="Watchii Adminにログイン" noFooter noMenu>
      <BaseLogin homeUrl={homeUrl} />
    </Layout>
  );
}
