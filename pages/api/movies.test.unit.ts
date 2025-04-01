import { expect } from 'chai';
import sinon from 'sinon';
import moviesEndpoint from './movies';

// First set up some mocked objects and stub network requests to write API unit tests
let mockedResponse:any;
let mockedResponseCode:any;
const res = { 
  status: (statusCode:number) => {
    return { 
      json: (resData:any) => {
        mockedResponseCode = statusCode;
        mockedResponse = resData;
      }
    };
  }
};
sinon.stub(global, 'fetch').callsFake(async ():Promise<Response> => {
  return new Promise((resolve) => {
    resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ Search: [{ Title: 'Mock Movie Title For Test', Year: '1977', imdbID: 'tt0076759' }] }),
    } as Response | PromiseLike<Response>);
  });
})

// Now we can write our unit tests
describe('api/movies endpoint', () => {
  
  it('should fail with status 500 and provide an error when OMDB_API_KEY environment variable is missing', async () => {
    const req = { query: { type: 'search', title: 'star wars' } };
    await moviesEndpoint(req as any, res as any);
    expect(mockedResponseCode).to.be.equal(500);
    expect(mockedResponse).to.have.property('error', 'Missing OMDB_API_KEY environment variable');
  });

  it('should fail with status 400 and provide an error when query.title param is missing', async () => {
    process.env['OMDB_API_KEY'] = 'mockApiKeyForTesting';
    const req = { query: { type: 'search' } };
    await moviesEndpoint(req as any, res as any);
    expect(mockedResponseCode).to.be.equal(400);
    expect(mockedResponse).to.have.property('error', 'Missing required query parameters.');
  });

  it('should fail with status 400 and provide an error when query.type param is missing', async () => {
    const req = { query: { title: 'star wars'  } };
    await moviesEndpoint(req as any, res as any);
    expect(mockedResponseCode).to.be.equal(400);
    expect(mockedResponse).to.have.property('error', 'Missing required query parameters.');
  });

  it('should succeed with status 200 when OMDB_API_KEY environment variable is defined', async () => {
    const req = { query: { type: 'search', title: 'star wars' } };
    await moviesEndpoint(req as any, res as any);
    expect(mockedResponseCode).to.be.equal(200);
    expect(mockedResponse.Search[0].Title).to.be.equal('Mock Movie Title For Test');
  });

  it('should fail with status 500 and provide an error when the fetch function fails', async () => {
    sinon.restore();
    sinon.stub(global, 'fetch').callsFake(async ():Promise<Response> => {
      throw new Error('Network error');
    });
    
    const req = { query: { type: 'search', title: 'star wars' } };
    await moviesEndpoint(req as any, res as any);
    expect(mockedResponseCode).to.be.equal(500);
    expect(mockedResponse instanceof Error).to.be.equal(true);
    expect(mockedResponse.message).to.be.equal('Network error');
  });

  it('should fail with status 500 and provide an error when the fetch function returns with !response.ok', async () => {
    sinon.restore();
    sinon.stub(global, 'fetch').callsFake(async ():Promise<Response> => {
      return new Promise((resolve) => {
        resolve({
          ok: false,
          status: 500
        } as Response | PromiseLike<Response>);
      });
    })
    
    const req = { query: { type: 'search', title: 'star wars' } };
    await moviesEndpoint(req as any, res as any);
    expect(mockedResponseCode).to.be.equal(500);
    expect(mockedResponse instanceof Error).to.be.equal(true);
    expect(mockedResponse.message).to.be.equal('HTTP error 500 requesting: http://www.omdbapi.com/?type=movie&apikey=mockApiKeyForTesting&s=star%20wars');
  });
  


});