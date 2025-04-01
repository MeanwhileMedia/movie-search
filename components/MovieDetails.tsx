import { useContext, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import { Typography } from '@mui/material';
import { AppStateContext } from '../pages/automatiq/moviesSearch.appStateContext';
import { MovieDetailsTypes } from './MovieDetails.d';
import { InfoResultTypes } from '../lib/obdbApi.d';

const fetchTitleInfo = async (titleSearchQuery: string): Promise<InfoResultTypes|null> => {
  try {
    const response = await fetch(`/api/movies?type=info&title=${titleSearchQuery}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} for movie title info query: ${titleSearchQuery}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchTitleInfo:', error);
    return await null;
  }
}

export default function MovieCardCollection() {
  const { 
    selectedMovieCard,
    titleInfoQuery, 
    setTitleInfoQuery,
    titleInfoResults, 
    setTitleInfoResults,
    titleInfoReqPending,
    setTitleInfoReqPending,
    queuedTitleInfoQuery,
    setQueuedTitleInfoQuery
  } = useContext(AppStateContext);
  
  useEffect(() => {
    if (titleInfoReqPending === true) return;
    if (queuedTitleInfoQuery) {
      console.log('Executing queued search query:', queuedTitleInfoQuery);
      setQueuedTitleInfoQuery('');
      setTitleInfoQuery(queuedTitleInfoQuery);
      return;
    }

    if (!titleInfoQuery || titleInfoResults[titleInfoQuery]) return;
    
    // Execute API req
    setTitleInfoReqPending(true);
    fetchTitleInfo(titleInfoQuery).then((response) => {
      if (!response) return;
      console.log('Fetched omdbApi info data for title:', titleInfoQuery, response);
      titleInfoResults[titleInfoQuery] = response;
      setTitleInfoResults({ ...titleInfoResults });
      setTitleInfoReqPending(false);
    });
  });

  const currentTitleInfoResults = titleInfoResults[titleInfoQuery]
  if (!selectedMovieCard || !currentTitleInfoResults) return null;

  const movieDetails:MovieDetailsTypes = {
    id: currentTitleInfoResults.imdbID,
    title: currentTitleInfoResults.Title,
    year: currentTitleInfoResults.Year,
    plot: currentTitleInfoResults.Plot,
    actors: currentTitleInfoResults.Actors,
    awards: currentTitleInfoResults.Awards,
    director: currentTitleInfoResults.Director,
    rated: currentTitleInfoResults.imdbRating,
  }

  return (
    <div className="movieDetails">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h2">{movieDetails.title} ({movieDetails.year})</Typography>
          <Rating sx={{marginTop: '0.8rem', fontSize: '2.4rem'}} name="read-only" value={currentTitleInfoResults.imdbRating/10*5} readOnly precision={0.5} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle1">{movieDetails.plot}</Typography>
      
          <div>
            <Typography variant="body2" sx={{ display: 'inline-block', fontWeight: '700', marginRight: '0.5rem', marginTop: '1rem'}}>Starring:</Typography>
            <Typography variant="body2" sx={{ display: 'inline-block' }}>{movieDetails.actors}</Typography>
          </div>
          
          <div>
            <Typography variant="body2" sx={{ display: 'inline-block', fontWeight: '700', marginRight: '0.5rem'}}>Director:</Typography>
            <Typography variant="body2" sx={{ display: 'inline-block' }}>{movieDetails.director}</Typography>
          </div>

          <div>
            <Typography variant="body2" sx={{ display: 'inline-block', fontWeight: '700', marginRight: '0.5rem'}}>Awards:</Typography>
            <Typography variant="body2" sx={{ display: 'inline-block' }}>{movieDetails.awards}</Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
