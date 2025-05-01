import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { createServerClient, fetchData, serializeCookieHeader } from '@repo/ui/utils';

import { PAGENATION_CONSTS } from '@/constants/pagenation-consts';
import Favs from '@/features/Favs/Favs';
import { FavsProps } from '@/features/Favs/types/favs-types';

const PER_PAGE = PAGENATION_CONSTS.PER_PAGE;

export const getServerSideProps: GetServerSideProps<FavsProps> = async ({ req, res, params }: GetServerSidePropsContext) => {
  // サーバー側でsupabaseクライアント作成
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] || '' }));
        },
        setAll(cookiesToSet) {
          res.setHeader(
            'Set-Cookie',
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options)),
          );
        },
      },
    },
  );

  // セッションを取得
  const { data: { session }, error } = await supabase.auth.getSession();

  if (!session || error) {
    return {
      notFound: true,
    };
  }

  const page = Number(params?.page) || 1;
  const offset = (page - 1) * PER_PAGE;

  try {
    const res = await fetchData(`/users/get-user-favs?limit=${PER_PAGE}&offset=${offset}&sort=desc`, session.access_token);

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const data = await res.json();

    return {
      props: {
        posts: data.posts,
        total: data.total,
        currentPage: page,
        perPage: PER_PAGE,
      },
    };
  }
  catch {
    return {
      notFound: true,
    };
  }
};

export default function FavsPage(props: FavsProps) {
  return <Favs {...props} />;
}
