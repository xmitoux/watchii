import { fetchData } from '@repo/ui/utils';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const endpoint = `/episodes/edit-data`;

  // パスパラメータのIDを取得
  const pathParamId = req.query.id;

  const apiUrl = `${endpoint}/${pathParamId}`;

  if (!process.env.API_BASE_URL) {
    return res.status(500).json({ message: 'API_BASE_URL is not defined' });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetchData(apiUrl);

      const data = await response.json();

      if (!response.ok) {
        throw new Error('エピソード編集データ取得処理に失敗しました。');
      }

      return res.status(200).json(data);
    }
    else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  }
  catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
