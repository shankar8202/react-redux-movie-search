import { Movie } from "@/lib/movieSlice"
import type React from "react"
interface MovieCardProps {
  movie: Movie
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://m.media-amazon.com/images/I/61qbMx4oXJL._AC_UF1000,1000_QL80_.jpg"
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={
            movie.Poster !== "N/A" ? movie.Poster : "https://m.media-amazon.com/images/I/61qbMx4oXJL._AC_UF1000,1000_QL80_.jpg"
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
