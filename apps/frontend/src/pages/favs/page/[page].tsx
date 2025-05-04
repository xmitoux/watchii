import { useRouter } from 'next/router';

import { PAGENATION_CONSTS } from '@/constants/pagenation-consts';
import Favs from '@/features/Favs/Favs';

const PER_PAGE = PAGENATION_CONSTS.PER_PAGE;

export default function FavsPage() {
  const router = useRouter();
  const { page } = router.query;
  const currentPage = Number(page) || 1;

  return <Favs currentPage={currentPage} perPage={PER_PAGE} />;
}
