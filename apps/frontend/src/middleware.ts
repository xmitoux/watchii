import { type NextRequest } from 'next/server';

import { supabaseSessionMiddleware, type SupabaseSessionMiddlewareOptions } from '@repo/ui/utils';

const options: SupabaseSessionMiddlewareOptions = {
  publicPaths: [
    '/login',
    '/signup',
    '/welcome',
    '/goodbye',
    '/reset-password',
    '/login-with-oauth',
    // 他にも認証不要のパスがあれば追加
  ],
  redirectUrl: '/welcome',
  homeUrl: '/home/page/1',
  intermediatePaths: [ // ログイン状態に関わらず表示可能なパス
    '/about/terms-of-use',
    '/about/privacy-policy',
  ],
};

export async function middleware(request: NextRequest) {
  return await supabaseSessionMiddleware(request, options);
}

// このミドルウェアから除外するパスを指定
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-*.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
