import { useContext, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { MovieFilter } from '@mui/icons-material';
import { AppStateContext } from '../pages/automatiq/moviesSearch.appStateContext';
import MovieCard from './MovieCard';
import { MovieCardPropTypes } from './MovieCard.d';
import { SearchResultTypes } from '../lib/obdbApi';
import styles from './MovieCardCollection.module.css';

const fetchTitleSearch = async (titleSearchQuery: string): Promise<SearchResultTypes|null> => {
  try {
    const response = await fetch(`/api/movies?type=search&title=${titleSearchQuery}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status} for movie title search query: ${titleSearchQuery}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in fetchTitleSearch:', error);
    return await null;
  }
}

export default function MovieCardCollection() {
  const { 
    titleSearchQuery, 
    setTitleSearchQuery,
    titleSearchResults, 
    setTitleSearchResults,
    titleSearchReqPending,
    setTitleSearchReqPending,
    queuedTitleSearchQuery,
    setQueuedTitleSearchQuery,
    selectedMovieCard
  } = useContext(AppStateContext);
  
  useEffect(() => {
    if (titleSearchReqPending === true) return;
    if (queuedTitleSearchQuery) {
      console.log('Executing queued info query:', queuedTitleSearchQuery);
      setQueuedTitleSearchQuery('');
      setTitleSearchQuery(queuedTitleSearchQuery);
      return;
    }

    if (!titleSearchQuery || titleSearchResults[titleSearchQuery]) return;
    
    // Execute API req
    console.log('Executing title search query:', titleSearchQuery, titleSearchReqPending);
    setTitleSearchReqPending(true);
    fetchTitleSearch(titleSearchQuery).then((response) => {
      if (!response) return;
      console.log('Fetched omdbApi data for url:', response);
      titleSearchResults[titleSearchQuery] = response;
      setTitleSearchResults({ ...titleSearchResults });
      setTitleSearchReqPending(false);
    });
  });

  const noResultsPlaceholder = (
    <div className={styles.movieCardCollection_emptyPlaceholder}><MovieFilter fontSize='inherit'/></div> // JWW stopping
  )

  if (!titleSearchQuery || !titleSearchResults[titleSearchQuery]?.Search) return noResultsPlaceholder; // there isn't yet a search result set available for this query. Render nothing for now.
  
  const renderMovieCards = titleSearchResults[titleSearchQuery].Search.map((searchResult:SearchResultTypes):MovieCardPropTypes => {
    return {
      id: searchResult.imdbID,
      title: searchResult.Title,
      poster: searchResult.Poster,
      year: searchResult.Year,
      plot: ''
    }
  });

  const movieCardEls: JSX.Element[] = [];
  renderMovieCards.forEach((movie:MovieCardPropTypes) => {
    if (movie.poster.slice(0,4) !== 'http') return; // If this result doesn't include a poster image then we won't render it.
    movieCardEls.push(
      <Grid key={movie.id} size={{ xs: 6, sm: 4, md: 3 }}>
        <MovieCard {...movie} />
      </Grid>
    );
  });

  if (movieCardEls.length === 0) return noResultsPlaceholder;
  
  let paddingForFixedNav = '12rem';
  if (selectedMovieCard) paddingForFixedNav = '22rem';

  return (
    <div style={{ paddingTop: paddingForFixedNav }}>
      <Grid container spacing={2}>
        {movieCardEls}
      </Grid>
    </div>
  );
}
