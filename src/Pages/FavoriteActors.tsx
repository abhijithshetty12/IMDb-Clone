// src/Pages/FavoriteActors.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import storage from '../utils/storage';

const FavoriteActors = () => {
  const [actors, setActors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const favorites = storage.getFavorites();
  const [error, setError] = useState<string | null>(null);

  const API_KEY = '859afbb4b98e3b467da9c99ac390e950';
  const ACTORS_URL = `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`;
  
  useEffect(() => {
    const fetchFavoriteActors = async () => {
      try {
        const favorites = storage.getFavorites();
        const actorPromises = favorites.map(async (id) => {
          const response = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`);
          return response.data;
        });
        const fetchedActors = await Promise.all(actorPromises);
        setActors(fetchedActors);
      } catch (err) {
        setError('Failed to fetch favorite actors');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteActors();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Favorite Actors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actors
          .filter((actor) => favorites.includes(actor.id))
          .map((actor) => (
            <div key={actor.id} className="border rounded-lg p-4">
              <img src={actor.image} alt={actor.name} className="w-full h-48 object-cover rounded-lg" />
              <h2 className="text-xl font-semibold mt-2">{actor.name}</h2>
              <p className="text-gray-600">{actor.birthDate} | {actor.birthPlace}</p>
              <p className="mt-2">{actor.biography}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FavoriteActors;