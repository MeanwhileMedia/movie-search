export function formOmdbApiUrl(type: string, title: string, omdbApiKey: string): string {
  const titleEncoded = encodeURIComponent(title.trim());
  if (type === 'search') {
    return `http://www.omdbapi.com/?type=movie&apikey=${omdbApiKey}&s=${titleEncoded}`;
  } else {
    return `http://www.omdbapi.com/?type=movie&apikey=${omdbApiKey}&t=${titleEncoded}`;
  }
}

export async function searchOmdbApi(type: string, title: string, omdbApiKey: string): Promise<any> {
  const omdbApiUrl = formOmdbApiUrl(type, title, omdbApiKey);
  try {
    const response = await fetch(omdbApiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} requesting: ${omdbApiUrl}`);
    }
    console.log('Fetched omdbApi data for url:', omdbApiUrl);
    return await response.json();
  } catch (error) {
    console.error('Error fetching omdbApi data:', error);
    throw error;
  }
}