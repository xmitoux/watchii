import Layout from '@/components/Layout/Layout';
import MessageWithImage from '@/components/MessageWithImage';

export default function Custom404() {
  return (
    <Layout title="404" canBack noFooter noMenu>
      <MessageWithImage title="ページが見つかりません！" imageSrc="/images/404.webp" />
    </Layout>
  );
}
