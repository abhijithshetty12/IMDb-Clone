import React, { useState, useEffect } from "react";
import WatchlistService from "../services/watchlist.service";

const watchlistService = new WatchlistService();

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleRemoveFromWatchlist = async (movieId: number) => {
    try {
      await watchlistService.removeMovieFromWatchlist(movieId);
      setWatchlist(watchlist.filter((movie) => movie.id !== movieId));
    } catch (err) {
      setError("Failed to remove movie from watchlist.");
    }
  };

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const movies = await watchlistService.getWatchlist();
        setWatchlist(movies);
      } catch (err) {
        setError("Failed to fetch watchlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlist.map((movie) => (
          <div key={movie.id} className="bg-gray-800 rounded-lg p-4">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="text-xl font-semibold mt-2">{movie.title}</h2>
            <p className="text-gray-400">{movie.releaseDate}</p>
            <p className="text-gray-400">{movie.genre.join(", ")}</p>
            <p className="text-gray-400">Rating: {movie.rating}</p>
            <button
              onClick={() => handleRemoveFromWatchlist(movie.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-400 transition-colors"
            >
              Remove from Watchlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
