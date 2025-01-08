import axios from 'axios';

const TMDB_API_KEY = 'your_tmdb_api_key'; // Replace with your actual TMDB API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

class WatchlistService {
  async getWatchlist() {
    const response = await axios.get(`${TMDB_BASE_URL}/account/{account_id}/watchlist`, {
      params: {
        api_key: TMDB_API_KEY,
        session_id: '{session_id}', // Replace with actual session ID
      },
    });
    return response.data.results;
  }

  async addMovieToWatchlist(movieId) {
    await axios.post(`${TMDB_BASE_URL}/account/{account_id}/watchlist`, {
      media_type: 'movie',
      media_id: movieId,
      watchlist: true,
      api_key: TMDB_API_KEY,
      session_id: '{session_id}', // Replace with actual session ID
    });
  }

  async removeMovieFromWatchlist(movieId) {
    await axios.post(`${TMDB_BASE_URL}/account/{account_id}/watchlist`, {
      media_type: 'movie',
      media_id: movieId,
      watchlist: false,
      api_key: TMDB_API_KEY,
      session_id: '{session_id}', // Replace with actual session ID
    });
  }
}

export default WatchlistService;
