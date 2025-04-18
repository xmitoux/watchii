import { fetchData } from '@repo/ui/utils';

import type { NextApiRequest, NextApiResponse } from 'next';

// エピソード選択対象のpostsを取得するAPI
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const endpoint = `/posts/episode-targets`;

  const params = new URLSearchParams();
  params.append('limit', req.query.limit!.toString());
  params.append('offset', req.query.offset!.toString());
  params.append('sort', req.query.sort!.toString());

  const episodeId = req.query.episodeId;
  if (episodeId) {
    // episodeIdが指定されている場合(編集時)は追加
    params.append('episodeId', episodeId.toString());
  }

  const queryString = params.toString();

  const apiUrl = `${endpoint}?${queryString}`;

  if (!process.env.API_BASE_URL) {
    return res.status(500).json({ message: 'API_BASE_URL is not defined' });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetchData(apiUrl);

      const data = await response.json();

      if (!response.ok) {
        throw new Error('エピソードPost一覧取得処理に失敗しました。');
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
