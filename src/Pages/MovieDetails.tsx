import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Calendar, Clock, Play, Heart, Languages, User, DollarSign, Globe } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  language: string;
  director: string;
  boxOffice: string;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
  poster_path: string;
  cast: { id: number; name: string; profile_path: string }[] | null;
  reviews: { id: string; author: string; content: string }[];
  trailers: any;
  images: { file_path: string }[];
  streamingLinks: any; 
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id;

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = '859afbb4b98e3b467da9c99ac390e950';
  const API_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,reviews,videos,images,watch/providers`;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(API_URL);
        const movieData = response.data;
        const director = movieData.credits?.crew?.find((member: any) => member.job === 'Director')?.name || 'Unknown Director';

        const streamingLinks = movieData['watch/providers']?.results?.US?.flatrate || [];

        setMovieDetails({
          id: movieData.id,
          title: movieData.title,
          language: movieData.original_language,
          director: director,
          boxOffice: movieData.revenue,
          overview: movieData.overview,
          release_date: movieData.release_date,
          genres: movieData.genres,
          runtime: movieData.runtime,
          poster_path: movieData.poster_path,
          vote_average: movieData.vote_average,
          cast: movieData.credits?.cast?.slice(0, 4).map((member: any) => ({
            id: member.id,
            name: member.name,
            profile_path: member.profile_path,
          })) || null,
          reviews: movieData.reviews?.results
            .filter((review: any) => review.content.length < 300)
            .map((review: any) => ({
              id: review.id,
              author: review.author,
              content: review.content,
            })) || [],
          trailers: movieData.videos?.results || [],
          images: movieData.images?.backdrops || [],
          streamingLinks: streamingLinks, 
        });
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [API_URL]);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const watchOnlineLink = movieDetails?.streamingLinks?.[0]?.url || '';

  return (
    <div className="bg-black text-white p-4">
      <div className="relative h-[60vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieDetails?.poster_path})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end">
            <div className="hidden md:block">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movieDetails?.poster_path}`}
                alt={movieDetails?.title}
                className="w-48 h-72 object-cover rounded-lg overflow-hidden shadow-xl transition-transform transform hover:scale-105"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">{movieDetails?.vote_average} Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{movieDetails?.runtime} minutes</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{movieDetails?.release_date}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movieDetails?.title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {movieDetails?.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-sm"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={watchOnlineLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  Watch Online
                </a>
                <button className="bg-gray-800/80 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <Swiper
          spaceBetween={5}
          slidesPerView={3}
          centeredSlides={false}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="swiper-container"
          style={{ width: '80%', margin: '0 auto' }}
        >
          {movieDetails?.trailers?.[0] && (
            <SwiperSlide>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${movieDetails.trailers[0].key}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </SwiperSlide>
          )}

          {movieDetails?.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                  alt={`Movie Image ${index}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div>
        <div className="sticky top-24 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-semibold mb-4">Movie Info</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-gray-400">Language</dt>
                <dd className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-blue-500" />
                  {movieDetails?.language}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="text-gray-400">Box Office</dt>
                <dd className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  {movieDetails?.boxOffice}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Director</dt>
                <dd className="flex items-center gap-1 text-gray-200">{movieDetails?.director}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Cast</h2>
        <div className="grid grid-cols-2 gap-6">
          {movieDetails?.cast?.map((actor) => (
            <Link
              key={actor.id}
              to={`/actor/${actor.id}`}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 flex gap-4 hover:bg-gray-700/50 transition-colors"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                alt={actor.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg mb-1">{actor.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Short Reviews</h2>
        <div className="space-y-6">
          {movieDetails?.reviews.map((review) => (
            <div key={review.id} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-semibold text-lg">{review.author}</h3>
              <p className="text-gray-300 mt-2">{review.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
