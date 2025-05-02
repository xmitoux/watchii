import { createBrowserClient, createServerClient, serializeCookieHeader } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export { createServerClient, serializeCookieHeader };

import { type NextRequest, NextResponse } from 'next/server';

export type SupabaseSessionMiddlewareOptions = {
  publicPaths: string[];
  redirectUrl: string;
  homeUrl: string;
};

// Supabase認証用ミドルウェア処理
// 参考: https://supabase.com/docs/guides/auth/server-side/creating-a-client
export async function supabaseSessionMiddleware(request: NextRequest, options: SupabaseSessionMiddlewareOptions) {
  let supabaseResponse = NextResponse.next({ request });

  // Supabaseクライアント作成
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // IMPORTANT: 重要！ここに他のコードを書かないで！
  // createServerClientとsupabase.auth.getUserの間にコードを入れると
  // デバッグが非常に難しくなる可能性があります
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // 認証チェック
  if (!user && !isPublicPath(path, options.publicPaths)) {
    // 未認証でパブリックでないパスの場合はログインページへリダイレクト
    const redirectUrl = new URL(options.redirectUrl, request.url);

    // リダイレクト後に元のURLに戻れるようにクエリパラメータを追加
    redirectUrl.searchParams.set('redirectTo', path);

    // 新しいレスポンスを作成する場合はクッキーを維持する必要がある
    const redirectResponse = NextResponse.redirect(redirectUrl);

    // 元のレスポンスのすべてのクッキーを新しいレスポンスに追加
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return redirectResponse;
  }

  // 認証済みユーザーがログインページなどにアクセスしたらホーム画面へ
  if (user && isPublicPath(path, options.publicPaths)) {
    const homeUrl = new URL(options.homeUrl, request.url);

    // 新しいレスポンスを作成する場合はクッキーを維持する必要がある
    const redirectResponse = NextResponse.redirect(homeUrl);

    // 元のレスポンスのすべてのクッキーを新しいレスポンスに追加
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return redirectResponse;
  }

  // IMPORTANT: クッキーの処理を変更しないでください！
  // 変更するとブラウザとサーバーの同期が取れなくなり、
  // ユーザーのセッションが予期せず終了する可能性があります。
  return supabaseResponse;
}

// パスが公開パスかどうかチェック
function isPublicPath(path: string, publicPaths: string[]) {
  return publicPaths.some((publicPath) =>
    path === publicPath || path.startsWith(`${publicPath}/`));
}
