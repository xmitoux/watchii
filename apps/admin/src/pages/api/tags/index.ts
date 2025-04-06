// タグ一覧取得(GET)と新規作成(POST)用のAPI Route🏷️
import { ApiResponse, callExternalApi } from '@/lib/api/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/tags';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    // GETリクエスト - 全タグを取得📋
    if (req.method === 'GET') {
      const data = await callExternalApi(endpoint, 'GET');
      return res.status(200).json({ success: true, data });
    }

    // POSTリクエスト - 新しいタグを作成✨
    else if (req.method === 'POST') {
      const data = await callExternalApi(endpoint, 'POST', req.body);
      return res.status(201).json({ success: true, data });
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
