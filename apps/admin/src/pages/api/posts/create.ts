import axios from 'axios';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const apiUrl = `${process.env.API_BASE_URL}/posts`;

  if (!process.env.API_BASE_URL) {
    return res.status(500).json({ message: 'API_BASE_URL is not defined' });
  }

  try {
    if (req.method === 'POST') {
      const { data } = await axios.post(
        apiUrl,
        req,
        {
          headers: {
            'Content-Type': req.headers['content-type'],
          },
          // タイムアウト時間を長めに設定(Post登録APIに上げる枚数が多いとタイムアウトするため)
          timeout: 30000,
        },
      );

      return res.status(201).json(data);
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
