// タグ詳細取得(GET)、更新(PUT)、削除(DELETE)用のAPI Route🔖
import { ApiResponse, callExternalApi } from '@/lib/api/helpers';

import type { NextApiRequest, NextApiResponse } from 'next';

const endpoint = '/tags';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  // タグIDをURLから取得
  const { id } = req.query;

  // IDが文字列かチェック
  if (!id || Array.isArray(id)) {
    return res.status(400).json({
      success: false,
      error: 'Valid tag ID is required',
    });
  }

  try {
    // GETリクエスト - 特定のタグを取得🔍
    if (req.method === 'GET') {
      const data = await callExternalApi(`${endpoint}/${id}`, 'GET');
      return res.status(200).json({ success: true, data });
    }

    // PUTリクエスト - タグを更新✏️
    else if (req.method === 'PUT') {
      const data = await callExternalApi(`${endpoint}/${id}`, 'PUT', req.body);
      return res.status(200).json({ success: true, data });
    }

    // DELETEリクエスト - タグを削除🗑️
    else if (req.method === 'DELETE') {
      await callExternalApi(`${endpoint}/${id}`, 'DELETE');
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
