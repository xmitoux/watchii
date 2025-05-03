import { ApiResponse, callExternalApi } from '@/lib/api/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/users';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    // POSTリクエスト - ユーザ登録✨
    if (req.method === 'POST') {
      const data = await callExternalApi(endpoint, 'POST', req.body);
      return res.status(201).json({ success: true, data });
    }
    // DELETEリクエスト - ユーザ削除🗑  ️
    else if (req.method === 'DELETE') {
      const token = req.headers.authorization;
      await callExternalApi(endpoint, 'DELETE', null, token);
      return res.status(200).json({ success: true });
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
