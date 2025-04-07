import { ApiResponse, callExternalApi } from '@/lib/api/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/characters';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  // IDをURLから取得
  const { id } = req.query;

  // IDが文字列かチェック
  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      error: 'Valid character ID is required',
    });
  }

  try {
    if (req.method === 'PUT') {
      const data = await callExternalApi(`${endpoint}/${id}`, 'PUT', req.body);
      return res.status(200).json({ success: true, data });
    }
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
