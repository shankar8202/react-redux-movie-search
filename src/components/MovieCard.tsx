import { Movie } from "@/lib/movieSlice"
import type React from "react"
interface MovieCardProps {
  movie: Movie
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://via.placeholder.com/300x400/cccccc/666666?text=No+Image"
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={
            movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x400/cccccc/666666?text=No+Image"
          }
          alt={movie.Title}
          onError={handleImageError}
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">Year: {movie.Year}</p>
        <p className="movie-type">Type: {movie.Type}</p>
        <div className="movie-plot">
          <p>{movie.Plot || "No plot available"}</p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
