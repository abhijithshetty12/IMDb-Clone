import "./App.css";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.tsx";
import { BrowserRouter, Routes ,Route} from "react-router-dom";
import Home from "./Pages/Home.tsx";
import MovieList from "./Pages/MovieList.tsx";
import MovieDetails from "./Pages/MovieDetails.tsx";
import Toprated from "./Pages/Toprated.jsx";
import Actordetails from "./Pages/Actordetails.tsx";
import FavoriteActors from './Pages/FavoriteActors.tsx';
import Watchlist from "./Pages/Watchlist.tsx";
function App() {
  const [darkMode, setDarkMode] = useState(true); // Set default to dark mode
  return (
  <BrowserRouter>
    <div className={`min-h-screen bg-black text-white`}>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/movies" element={<MovieList/>}/>
          <Route path="/movie/:id" element={<MovieDetails/>}/>
          <Route path="/actor/:id" element={<Actordetails/>}/>
          <Route path="/top-rated" element={<Toprated/>}/>
          <Route path="/favorite-actors" element={<FavoriteActors />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
