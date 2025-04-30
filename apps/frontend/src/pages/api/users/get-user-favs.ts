import { ApiResponse, callExternalApi } from '@/lib/api/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/users/get-user-favs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    // GETリクエスト - ユーザのお気に入り一覧取得🔍
    if (req.method === 'GET') {
      const token = req.headers.authorization;
      const data = await callExternalApi(endpoint, 'GET', null, token);
      return res.status(200).json({ success: true, data });
    }

    // サポートしてないメソッド🚫
    else {
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
    }
  }
  catch (error) {
    console.error('API error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}
