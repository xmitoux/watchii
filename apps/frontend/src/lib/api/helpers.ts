/* eslint-disable @typescript-eslint/no-explicit-any */

// バックエンドAPIへのリクエスト処理をまとめたヘルパー
export const callExternalApi = async (
  endpoint: string,
  method: string,
  body?: any,
  bearerToken?: string,
) => {
  const baseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey || '',
  };

  // 認証が必要な場合はトークンを取得して追加
  if (bearerToken) {
    headers['Authorization'] = bearerToken;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  const apiUrl = `${baseUrl}${endpoint}`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    // エラーの詳細を取得
    let errorText = `API(${apiUrl}) error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorText = errorData.message;
      }
    }
    catch {
      // JSONじゃなかったらそのまま
    }
    throw new Error(errorText);
  }

  // レスポンスがあればJSONで返す、なければnullを返す
  try {
    return await response.json();
  }
  catch {
    return null;
  }
};

// レスポンスの型定義
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};
