import { ApiResponse, callExternalApi } from '@/lib/api/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/users/verify-admin-user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    // POSTリクエスト - 管理者の検証🔍
    if (req.method === 'POST') {
      const token = req.headers.authorization;
      const data = await callExternalApi(endpoint, 'POST', req.body, token);
      if (data && data.isAdmin) {
        return res.status(200).json({ success: true });
      }
      else {
        return res.status(403).json({
          success: false,
          error: '管理者権限がありません！',
        });
      }
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
