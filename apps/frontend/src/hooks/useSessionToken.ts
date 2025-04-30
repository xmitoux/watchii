import { createClient } from '@repo/ui/utils';

export function useSessionToken() {
  const supabase = createClient();

  // セッショントークンを取得
  const getSessionToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  return {
    getSessionToken,
  };
}
