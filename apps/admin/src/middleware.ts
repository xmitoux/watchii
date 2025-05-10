import { type NextRequest } from 'next/server';

import { supabaseSessionMiddleware, type SupabaseSessionMiddlewareOptions } from '@repo/ui/utils';

const options: SupabaseSessionMiddlewareOptions = {
  publicPaths: [
    '/login',
    // 他にも認証不要のパスがあれば追加
  ],
  redirectUrl: '/login',
  homeUrl: '/posts',
};

export async function middleware(request: NextRequest) {
  return await supabaseSessionMiddleware(request, options);
}

// このミドルウェアから除外するパスを指定
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
