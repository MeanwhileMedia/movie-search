import { NextApiRequest, NextApiResponse } from 'next';
import { searchOmdbApi } from '../../lib/omdbApi.helper';

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const omdbApiKey = process.env.OMDB_API_KEY;
  if (!omdbApiKey) {
    const error = 'Missing OMDB_API_KEY environment variable';
    console.error(error);
    res.status(500).json({ error });
    return;
  }

  if (typeof req.query.title !== 'string' || typeof req.query.type !== 'string') {
    const error = 'Missing required query parameters.';
    console.error(error);
    res.status(400).json({ error });
    return;
  }

  try {
    const movieSearchData = await searchOmdbApi(req.query.type, req.query.title, omdbApiKey);
    console.log('Fetched data:', movieSearchData);
    res.status(200).json(movieSearchData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json(error);
  }

};
