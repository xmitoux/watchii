export async function fetchData(endpoint: string) {
  return await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
    headers: {
      'x-api-key': process.env.API_KEY || '',
    },
  });
}
