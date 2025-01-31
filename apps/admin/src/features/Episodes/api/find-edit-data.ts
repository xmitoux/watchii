import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apiUrl = `${process.env.API_BASE_URL}/episodes/edit-data`;

  // パスパラメータのIDを取得
  const pathParamId = req.query.id;

  const endpoint = `${apiUrl}/${pathParamId}`;

  if (!process.env.API_BASE_URL) {
    return res.status(500).json({ message: 'API_BASE_URL is not defined' });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(endpoint);
      const data = await response.json();

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
