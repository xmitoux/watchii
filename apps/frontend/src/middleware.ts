import { type NextRequest } from 'next/server';

import { supabaseSessionMiddleware, type SupabaseSessionMiddlewareOptions } from '@repo/ui/utils';

const options: SupabaseSessionMiddlewareOptions = {
  publicPaths: [
    '/login',
    // 他にも認証不要のパスがあれば追加
  ],
  redirectUrl: '/login',
  homeUrl: '/home/page/1',
};

export async function middleware(request: NextRequest) {
  return await supabaseSessionMiddleware(request, options);
}

// このミドルウェアを適用するパス
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
