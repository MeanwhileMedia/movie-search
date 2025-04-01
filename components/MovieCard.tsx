import Image from 'next/image'
import { useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { MovieCardPropTypes } from './MovieCard.d';
import { AppStateContext } from '../pages/automatiq/moviesSearch.appStateContext';
import styles from './MovieCard.module.css';

export default function MovieCard(props: MovieCardPropTypes) {
  const { 
    selectedMovieCard, 
    setSelectedMovieCard,
    titleInfoReqPending,
    setQueuedTitleInfoQuery,
    setTitleInfoQuery
  } = useContext(AppStateContext);

  const onMovieCardClick = () => {
    if (selectedMovieCard === props.id) {
      setSelectedMovieCard('');
      return;
    }
    setSelectedMovieCard(props.id);

    // Init a request for the movie info (so can render MovieDetails component)
    if (titleInfoReqPending === true) {
      // If a title info request is pending, queue the search query. It will execute after the current request completes.
      console.log('Queuing movie info query:', props.title);
      setQueuedTitleInfoQuery(props.title);
    } else {
      setTitleInfoQuery(props.title);
    }
  }

  let isSelected = false;
  if (selectedMovieCard === props.id) isSelected = true;
  let isUnselected = false;
  if (selectedMovieCard && selectedMovieCard !== props.id) isUnselected = true;

  let additionalStyles = [];
  if (isSelected) additionalStyles.push(styles.card__selected);
  if (isUnselected) additionalStyles.push(styles.card__unselected);

  return (
    <Card variant='outlined' className={styles.card + ' ' + additionalStyles.join(' ')}>
      <CardContent onClick={() => { onMovieCardClick() }}>
        <div className={styles.card_content} >
          <Image 
            src={props.poster} 
            alt={`Movie poster for ${props.title}`}
            fill={true} 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardContent>
    </Card>
  );
}
