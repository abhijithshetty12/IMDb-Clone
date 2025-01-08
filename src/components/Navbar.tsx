import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import axios from 'axios'; // Ensure Axios is imported
import { Film, Search, Menu, X, Heart, Star, Calendar, Bookmark } from 'lucide-react'; // Import User icon
import { Link, useNavigate } from 'react-router-dom';
import storage from '../utils/storage';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [movies, setMovies] = useState([]); // State for movies
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/movies?search=${encodeURIComponent(search)}`);
      setSearch('');
      setIsOpen(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY'); // Replace with your TMDB API key
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies(); // Fetch movies on component mount
  }, []);

  const navItems = [
    { label: 'Movies', path: '/movies', icon: <Film className="w-5 h-5" /> },
    { label: 'Top Rated', path: '/top-rated', icon: <Star className="w-5 h-5" /> },
    { label: 'Coming Soon', path: '/coming-soon', icon: <Calendar className="w-5 h-5" /> },
    {
      label: `Favorite Actors (${storage.getFavorites().length})`,
      path: '/favorite-actors',
      icon: <Heart className="w-5 h-5" />,
    },
    { label: 'Watchlist', path: '/watchlist', icon: <Bookmark className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-black/70 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover-glow">
              <Film className="w-8 h-8 text-yellow-500" />
              <span className="text-xl font-bold text-glow">MovieDB</span>
            </Link>
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies..."
                className="bg-zinc-900/80 backdrop-blur-md text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 w-64 transition-all"
              />
            </form>
          </div>

          <div className="hidden md:flex items-center justify-end gap-4">
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-zinc-300 hover:text-white transition-colors hover-glow"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-black"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg rounded-lg">
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search movies..."
                  className="bg-gray-100 text-black px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-black-500"
                />
                <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600">
                  <Search className="w-5 h-5" />
                </button>
              </form>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-2 text-black hover:text-white transition-all duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;