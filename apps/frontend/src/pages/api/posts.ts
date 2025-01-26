import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // クエリパラメータを URLSearchParams で組み立て 🔨
  const params = new URLSearchParams();

  // req.query の中身を URLSearchParams に追加
  for (const [key, value] of Object.entries(req.query)) {
    if (value) {
      params.append(key, value.toString());
    }
  }

  // クエリパラメータがある場合は '?' をつけて追加
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const apiUrl = `${process.env.API_BASE_URL}/posts${queryString}`;

  if (!process.env.API_BASE_URL) {
    return res.status(500).json({ message: 'API_BASE_URL is not defined' });
  }

  try {
    if (req.method === 'GET') {
      const response = await fetch(apiUrl);
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
