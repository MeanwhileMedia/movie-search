import { useContext } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useDebouncedCallback } from 'use-debounce';
import { AppStateContext } from '../pages/automatiq/moviesSearch.appStateContext';
import styles from './SearchInput.module.css';

export default function SearchInput() {
  const { 
    titleSearchQuery, 
    setTitleSearchQuery, 
    titleSearchReqPending, 
    setQueuedTitleSearchQuery,
    setSelectedMovieCard
  } = useContext(AppStateContext);
  
  // Because we execute the onChange function on every key press, we need to debounce it to prevent excessive API calls.
  const onChange = useDebouncedCallback((value: string) => {
    if (value === '' || value === titleSearchQuery) return;
    if (titleSearchReqPending === true) {
      // If a search request is pending, queue the search query. It will execute after the current request completes.
      console.log('Queuing search query:', value);
      setQueuedTitleSearchQuery(value);
    } else {
      setSelectedMovieCard(''); // stop showing details of previously selected movie - new search incoming
      setTitleSearchQuery(value);
    }
  }, 500);

  return (
    <div className={styles.searchInput}>
      <TextField
        fullWidth
        label="Search Movie Title"
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end"><Search /></InputAdornment>
          },
        }}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
