import Layout from '@/components/Layout/Layout';
import MessageWithImage from '@/components/MessageWithImage';

export default function Goodbye() {
  return (
    <Layout title="退会完了" noFooter noMenu>
      <MessageWithImage title="退会が完了しました" messages="ご利用ありがとうございました！" imageSrc="/images/goodbye.webp" />
    </Layout>
  );
}
