import { Movie } from "@/lib/movieSlice"
import type React from "react"
interface MovieCardProps {
  movie: Movie
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "https://media.istockphoto.com/id/2175700684/photo/abstract-glitter-background-bokeh-shallow-depth-of-field-selective-focus-loopable.webp?a=1&b=1&s=612x612&w=0&k=20&c=yVJotMu-d_iCcmw6rydJcxYYjxbidwQnyferJRirAfM="
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={
            movie.Poster !== "N/A" ? movie.Poster : "https://media.istockphoto.com/id/2175700684/photo/abstract-glitter-background-bokeh-shallow-depth-of-field-selective-focus-loopable.webp?a=1&b=1&s=612x612&w=0&k=20&c=yVJotMu-d_iCcmw6rydJcxYYjxbidwQnyferJRirAfM="
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
