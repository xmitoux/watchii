import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apiUrl = `${process.env.API_BASE_URL}/episodes`;

  if (!process.env.API_BASE_URL) {
    return res.status(500).json({ message: 'API_BASE_URL is not defined' });
  }
  try {
    if (req.method === 'PUT') {
      // パスパラメータのIDを取得
      const pathParamId = req.query.id;
      const endpoint = `${apiUrl}/${pathParamId}`;

      await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY || '',
        },
        body: JSON.stringify(req.body),
      });

      return res.status(200).json({ message: 'Updated' });
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

export const config = {
  api: {
    bodyParser: false,
  },
};
