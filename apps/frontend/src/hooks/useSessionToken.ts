import { createClient } from '@repo/ui/utils';

export function useSessionToken() {
  const supabase = createClient();

  // セッショントークンを取得
  const getSessionToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  // セッショントークンとリフレッシュトークンを取得
  const getSessionTokenData = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      return null;
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  };

  return {
    getSessionToken,
    getSessionTokenData,
  };
}
