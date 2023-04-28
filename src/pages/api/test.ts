// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fetchApi } from '@/server/fetch-api';
import type { NextApiRequest, NextApiResponse } from 'next';

type DataResponse = {
  cached: number[];
  uncached: number[];
};

type ErrorResponse = {
  error: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse | ErrorResponse>
) {
  try {
    const url = JSON.parse(req.body).url;
    const fetched = await fetchApi(url);
    res.status(200).json({
      ...fetched,
    });
  } catch (e: any) {
    res.status(400).json({
      error: e?.message || 'Unknown error',
    });
  }
}
