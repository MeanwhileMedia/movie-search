import Layout from '../../components/layout';
import { AppStateContextProvider } from './moviesSearch.appStateContext';
import SearchInput from '../../components/SearchInput';
import MovieDetails from '../../components/MovieDetails';
import MovieCardCollection from '../../components/MovieCardCollection';
import styles from './moviesSearch.module.css';

export default function MoviesSearch() {
  return (
    <AppStateContextProvider>
      <Layout>
        <div className={`moviesSearch_fixedHero ${styles.moviesSearch_fixedHero}`}>
          <div className={styles.moviesSearch_fixedHero_inner}><SearchInput />
            <MovieDetails />
          </div>
        </div>
        <div className={`moviesSearch_content ${styles.moviesSearch_content}`}>
          <MovieCardCollection />
        </div>
      </Layout>
    </AppStateContextProvider>
  )
}
