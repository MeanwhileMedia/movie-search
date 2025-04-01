import { createContext, useState } from 'react';

////////
// Define app state and types into a new react context.
interface AppStateContextTypes {
  titleSearchQuery: string;
  setTitleSearchQuery: React.Dispatch<React.SetStateAction<AppStateContextTypes["titleSearchQuery"]>>;

  titleSearchResults: Record<string, any>; // JWW TODO: Define this type.
  setTitleSearchResults: React.Dispatch<React.SetStateAction<AppStateContextTypes["titleSearchResults"]>>;

  titleSearchReqPending: boolean;
  setTitleSearchReqPending: React.Dispatch<React.SetStateAction<AppStateContextTypes["titleSearchReqPending"]>>;

  queuedTitleSearchQuery: string;
  setQueuedTitleSearchQuery: React.Dispatch<React.SetStateAction<AppStateContextTypes["queuedTitleSearchQuery"]>>;

  selectedMovieCard: string;
  setSelectedMovieCard: React.Dispatch<React.SetStateAction<AppStateContextTypes["selectedMovieCard"]>>;

  titleInfoQuery: string;
  setTitleInfoQuery: React.Dispatch<React.SetStateAction<AppStateContextTypes["titleInfoQuery"]>>;

  titleInfoResults: Record<string, any>; // JWW TODO: Define this type.
  setTitleInfoResults: React.Dispatch<React.SetStateAction<AppStateContextTypes["titleInfoResults"]>>;

  titleInfoReqPending: boolean;
  setTitleInfoReqPending: React.Dispatch<React.SetStateAction<AppStateContextTypes["titleInfoReqPending"]>>;

  queuedTitleInfoQuery: string;
  setQueuedTitleInfoQuery: React.Dispatch<React.SetStateAction<AppStateContextTypes["queuedTitleInfoQuery"]>>;
}
const AppStateContextInitialState: AppStateContextTypes = {
  titleSearchQuery: '',
  setTitleSearchQuery: () => undefined,

  titleSearchResults: {},
  setTitleSearchResults: () => undefined,

  titleSearchReqPending: false,
  setTitleSearchReqPending: () => undefined,

  queuedTitleSearchQuery: '',
  setQueuedTitleSearchQuery: () => undefined,

  selectedMovieCard: '',
  setSelectedMovieCard: () => undefined,

  titleInfoQuery: '',
  setTitleInfoQuery: () => undefined,

  titleInfoResults: {},
  setTitleInfoResults: () => undefined,

  titleInfoReqPending: false,
  setTitleInfoReqPending: () => undefined,

  queuedTitleInfoQuery: '',
  setQueuedTitleInfoQuery: () => undefined
}
export const AppStateContext = createContext(AppStateContextInitialState);


////////
// Define/export the context provider to be used by the matching top level react component (AutomatiqRoute.tsx). 
// Make sure all useState for this app are defined now and attached to the global context.
export const AppStateContextProvider = ({children}: React.PropsWithChildren<{}>) => {

  // A search query for movie title as entered by user into SearchInput component.
  const [titleSearchQuery, setTitleSearchQuery] = useState(AppStateContextInitialState.titleSearchQuery);

  // Search results response from our api/search/movies endpoint (for current titleSearchQuery).
  const [titleSearchResults, setTitleSearchResults] = useState(AppStateContextInitialState.titleSearchResults);

  // A flag to indicate if a search request is pending.
  const [titleSearchReqPending, setTitleSearchReqPending] = useState(AppStateContextInitialState.titleSearchReqPending);

  // A search query for movie title that has been queued because titleSearchReqPending was true.
  const [queuedTitleSearchQuery, setQueuedTitleSearchQuery] = useState(AppStateContextInitialState.queuedTitleSearchQuery);

  // The ID of the movie card that the user selected (empty string if none).
  const [selectedMovieCard, setSelectedMovieCard] = useState(AppStateContextInitialState.selectedMovieCard);

  // A search query to get movie plot details (for selectedMovieCard). Will be the movie title.
  const [titleInfoQuery, setTitleInfoQuery] = useState(AppStateContextInitialState.titleInfoQuery);

  // Movie info results response from our api/search/movies endpoint (for current titleInfoQuery).
  const [titleInfoResults, setTitleInfoResults] = useState(AppStateContextInitialState.titleInfoResults);

  // A flag to indicate if a movie info request is pending.
  const [titleInfoReqPending, setTitleInfoReqPending] = useState(AppStateContextInitialState.titleInfoReqPending);

  // An info query for movie title that has been queued because titleInfoReqPending was true.
  const [queuedTitleInfoQuery, setQueuedTitleInfoQuery] = useState(AppStateContextInitialState.queuedTitleInfoQuery);

  return (
    <AppStateContext.Provider value={{
      titleSearchQuery,
      setTitleSearchQuery,

      titleSearchResults,
      setTitleSearchResults,

      titleSearchReqPending,
      setTitleSearchReqPending,

      queuedTitleSearchQuery,
      setQueuedTitleSearchQuery,

      selectedMovieCard,
      setSelectedMovieCard,

      titleInfoQuery,
      setTitleInfoQuery,

      titleInfoResults,
      setTitleInfoResults,

      titleInfoReqPending, 
      setTitleInfoReqPending,

      queuedTitleInfoQuery,
      setQueuedTitleInfoQuery
    }}>
      {children}
    </AppStateContext.Provider>
  )
}
