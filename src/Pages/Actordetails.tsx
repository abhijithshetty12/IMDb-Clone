import React, { useState, useEffect } from "react";
import axios from "axios";
import { Award, Instagram, Star, Twitter, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import storage from '../utils/storage';

const Actordetails = () => {
  const { id } = useParams();
  const [actor, setActor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false); // Track favorite status

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev); // Toggle favorite status
  };
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.TMDB_API_KEY;
  const ACTOR_URL = `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&append_to_response=movie_credits`;

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const response = await axios.get(ACTOR_URL);
        setActor(response.data);
      } catch (err) {
        setError('Failed to fetch actor details');
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [ACTOR_URL]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading || !actor ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${actor.profile_path ? `https://image.tmdb.org/t/p/original${actor.profile_path}` : ''})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
            </div>
            <div className="relative h-full container flex items-end pb-8">
              <div className="flex items-end gap-8">
                <img
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/original${actor.profile_path}` : ''} // Updated to use profile_path
                  alt={actor.name}
                  className="w-48 h-48 rounded-xl object-cover border-4 border-gray-900"
                />
                <div>
                  <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span>{actor.popularity} Average Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      <span>{actor.known_for_department} Awards</span>
                    </div>
                  </div>
                  <button
                    className={`bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-colors ${isFavorite ? 'bg-red-500' : ''}`}
                    onClick={handleFavorite}
                  >
                    {isFavorite ? (
                      <Heart className="w-5 h-5 text-white" />
                    ) : (
                      <Heart className="w-5 h-5 text-orange" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">Biography</h2>
            <p>{actor.biography || 'Biography not available.'}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">Known For</h2>
            <ul className="list-disc pl-5">
              {actor.known_for && actor.known_for.length > 0 ? (
                actor.known_for.map((movie) => (
                  <li key={movie.id} className="mb-2">
                    <Link to={`/movies/${movie.id}`} className="text-blue-500 hover:underline">
                      {movie.title} ({movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}) - {movie.character || 'Role not specified'}
                    </Link>
                  </li>
                ))
              ) : (
                <li>No known projects available.</li>
              )}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">Awards</h2>
            <ul className="list-disc pl-5">
              {actor.awards && actor.awards.length > 0 ? (
                actor.awards.map((award, index) => (
                  <li key={index} className="mb-2">
                    {award.name} ({award.year}) - {award.category} for {award.film}
                  </li>
                ))
              ) : (
                <li>No awards available.</li>
              )}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">Upcoming Projects</h2>
            <ul className="list-disc pl-5">
              {actor.upcoming_projects && actor.upcoming_projects.length > 0 ? (
                actor.upcoming_projects.map((project, index) => (
                  <li key={index} className="mb-2">
                    {project.title} - {project.character} - Status: {project.status} (Expected Release: {project.release_date})
                  </li>
                ))
              ) : (
                <li>No upcoming projects available.</li>
              )}
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold">Social Media</h2>
            <div className="flex gap-4">
              {actor.social_media && (
                <>
                  {actor.social_media.instagram && (
                    <a href={actor.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Instagram
                    </a>
                  )}
                  {actor.social_media.twitter && (
                    <a href={actor.social_media.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Twitter
                    </a>
                  )}
                  {actor.social_media.imdb && (
                    <a href={actor.social_media.imdb} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      IMDb
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Actordetails;