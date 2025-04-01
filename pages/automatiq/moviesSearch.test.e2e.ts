describe('Movies Search Page', () => {

  beforeEach(() => {
    // First intercept requests to the movie search API
    // and the movie info API, and return mock data.
    // This is done to avoid hitting the actual API and
    // to ensure the tests are deterministic and fast.
    cy.intercept(
      {
        method: 'GET',
        url: '/api/movies?type=search*',
      },
      mockMovieSearchResponse
    ).as('movieSearch')

    cy.intercept(
      {
        method: 'GET',
        url: '/api/movies?type=info*',
      },
      mockMovieInfoResponse
    ).as('movieInfo')
  });

  it('should load the movies search page with fixed hero and content sections', () => {
    cy.visit('/automatiq/moviesSearch');
    cy.get('.moviesSearch_fixedHero').should('exist');
    cy.get('.moviesSearch_content').should('exist');
  });

  it('should render a movie collection after the user inputs a search query', () => {
    cy.visit('/automatiq/moviesSearch');
    cy.get('input').type('Batman');
    cy.get('img[alt="Movie poster for Batman Begins"]').should('exist');
  });

  it('should render a movie description after the user clicks a movie poster', () => {
    cy.visit('/automatiq/moviesSearch');
    cy.get('input').type('Batman');
    cy.get('img[alt="Movie poster for Batman Begins"]').should('exist');
    cy.get('img[alt="Movie poster for Batman Begins"]').click();
    cy.get('.movieDetails').should('exist');
    cy.get('.movieDetails').contains('Batman Begins');
  });
});

const mockMovieSearchResponse = {
  Search: [
    {
      Title: 'Batman Begins',
      Year: '2005',
      imdbID: 'tt0372784',
      Type: 'movie',
      Poster: 'https://m.media-amazon.com/images/M/MV5BODIyMDdhNTgtNDlmOC00MjUxLWE2NDItODA5MTdkNzY3ZTdhXkEyXkFqcGc@._V1_SX300.jpg'
    },
    {
      Title: 'The Batman',
      Year: '2022',
      imdbID: 'tt1877830',
      Type: 'movie',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_SX300.jpg'
    },
    {
      Title: 'Batman v Superman: Dawn of Justice',
      Year: '2016',
      imdbID: 'tt2975590',
      Type: 'movie',
      Poster: 'https://m.media-amazon.com/images/M/MV5BZTJkYjdmYjYtOGMyNC00ZGU1LThkY2ItYTc1OTVlMmE2YWY1XkEyXkFqcGc@._V1_SX300.jpg'
    },
    {
      Title: 'Batman',
      Year: '1989',
      imdbID: 'tt0096895',
      Type: 'movie',
      Poster: 'https://m.media-amazon.com/images/M/MV5BYzZmZWViM2EtNzhlMi00NzBlLWE0MWEtZDFjMjk3YjIyNTBhXkEyXkFqcGc@._V1_SX300.jpg'
    }
  ],
  totalResults: '487',
  Response: 'True'
}

const mockMovieInfoResponse = {
  Title: "Batman Begins",
  Year: "2005",
  Rated: "PG-13",
  Released: "15 Jun 2005",
  Runtime: "140 min",
  Genre: "Action, Drama",
  Director: "Christopher Nolan",
}