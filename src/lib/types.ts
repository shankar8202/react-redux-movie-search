export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

export interface MoviesState {
  movies: Movie[]
  loading: boolean
  error: string | null
  totalResults: number
  currentPage: number
}

export interface SearchMoviesParams {
  query: string
  page: number
}
