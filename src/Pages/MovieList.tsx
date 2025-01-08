import { Search, SlidersHorizontal, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  vote_average: number; // This will be used as rating
  backdrop_path: string | null;
  release_date: string;
  genre: string[];
  year: number; // Add this line
}

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]); // State to hold fetched movies
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const [genreFilter, setGenreFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState({ min: 0, max: 10 });
const [actorFilter, setActorFilter] = useState("");
const [error, setError] = useState<string | null>(null);

  const API_KEY = '859afbb4b98e3b467da9c99ac390e950';
  const MOVIE_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(MOVIE_URL);
        setMovies(response.data.results);
      } catch (err) {
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie: Movie) => {
    const genreMatch = genreFilter === "" || movie.genre.includes(genreFilter);
    const yearMatch = yearFilter === "" || movie.year === parseInt(yearFilter);
    const ratingMatch =
      movie.vote_average >= ratingFilter.min && movie.vote_average <= ratingFilter.max;
    return genreMatch && yearMatch && ratingMatch;
  });

  const handleGenreChange = (e) => setGenreFilter(e.target.value);
  const handleYearChange = (e) => setYearFilter(e.target.value);
  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingFilter((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transition">
          <SlidersHorizontal /> Filters
        </button>
      </div>

      <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white">Filters</h2>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Genre</label>
              <select
                value={genreFilter}
                onChange={handleGenreChange}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
              >
                <option value="">All</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Biography">Biography</option>
                <option value="Crime">Crime</option>
                <option value="History">History</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Year</label>
              <input
                type="number"
                value={yearFilter}
                onChange={handleYearChange}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                placeholder="Enter year"
              />
            </div>

            <div>
<label className="block mb-2 text-gray-700 dark:text-gray-300">Actor</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="min"
                  value={ratingFilter.min}
                  onChange={handleRatingChange}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                  placeholder="Min"
                />
                <input
                  type="number"
                  name="max"
                  value={ratingFilter.max}
                  onChange={handleRatingChange}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-gray-900 dark:text-gray-300"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 lg:col-span-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <img src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : ''} alt={movie.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {movie.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Rating: {movie.vote_average}</p>
                <p className="text-gray-600 dark:text-gray-400">Year: {movie.year}</p>
<p className="text-gray-600 dark:text-gray-400">
  Genre: {Array.isArray(movie.genre) ? movie.genre.join(", ") : "N/A"}
</p>
                <Link
                  to={`/movies/${movie.id}`}
                  className="mt-4 inline-block text-indigo-500 hover:text-indigo-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
