import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
  Plot?: string
}


export interface MovieState {
  movies: Movie[]
  loading: boolean
  error: string | null
  searchTerm: string
  currentPage: number
  totalResults: number
  totalPages: number
  defaultMoviesLoaded: boolean
  defaultMovieQuery: string 
}


const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
  searchTerm: "",
  currentPage: 1,
  totalResults: 0,
  totalPages: 0,
  defaultMoviesLoaded: false,
  defaultMovieQuery: "", 
}


export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ searchTerm, page }: { searchTerm: string; page: number }) => {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&page=${page}&apikey=89789cc7`,
    )
    const data = await response.json()

    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch movies")
    }

    const moviesWithDetails = await Promise.all(
      data.Search.map(async (movie: Movie) => {
        try {
          const detailResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=89789cc7`)
          const detailData = await detailResponse.json()
          return {
            ...movie,
            Plot: detailData.Plot || "No plot available",
          }
        } catch {
          return {
            ...movie,
            Plot: "No plot available",
          }
        }
      }),
    )

    return {
      movies: moviesWithDetails,
      totalResults: Number.parseInt(data.totalResults),
      totalPages: Math.ceil(Number.parseInt(data.totalResults) / 10),
    }
  },
)

export const fetchDefaultMovies = createAsyncThunk(
  "movies/fetchDefaultMovies",
  async ({ page, query }: { page: number; query?: string }, { getState }) => {
    // Array of popular movie titles to search for
    const popularMovies = ["Avengers", "Star Wars", "Jurassic Park", "Harry Potter", "Batman"]

    // Use the provided query, or get the existing one from state, or pick a random one
    const state = getState() as { movies: MovieState }
    let movieQuery = query

    if (!movieQuery) {
      movieQuery = state.movies.defaultMovieQuery || popularMovies[Math.floor(Math.random() * popularMovies.length)]
    }

    const response = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(movieQuery)}&page=${page}&apikey=89789cc7`,
    )
    const data = await response.json()

    if (data.Response === "False") {
      throw new Error(data.Error || "Failed to fetch default movies")
    }

    const moviesWithDetails = await Promise.all(
      data.Search.map(async (movie: Movie) => {
        try {
          const detailResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=89789cc7`)
          const detailData = await detailResponse.json()
          return {
            ...movie,
            Plot: detailData.Plot || "No plot available",
          }
        } catch {
          return {
            ...movie,
            Plot: "No plot available",
          }
        }
      }),
    )

    return {
      movies: moviesWithDetails,
      totalResults: Number.parseInt(data.totalResults),
      totalPages: Math.ceil(Number.parseInt(data.totalResults) / 10),
      query: movieQuery,
    }
  },
)

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    clearMovies: (state) => {
      state.movies = []
      state.totalResults = 0
      state.totalPages = 0
      state.error = null
      state.defaultMoviesLoaded = false 
      state.defaultMovieQuery = "" 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload.movies
        state.totalResults = action.payload.totalResults
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch movies"
        state.movies = []
      })
      
      .addCase(fetchDefaultMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      
      .addCase(fetchDefaultMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload.movies
        state.totalResults = action.payload.totalResults
        state.totalPages = action.payload.totalPages
        state.defaultMoviesLoaded = true
        state.defaultMovieQuery = action.payload.query 
      })
      .addCase(fetchDefaultMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch default movies"
        state.movies = []
      })
  },
})

export const { setSearchTerm, setCurrentPage, clearMovies } = movieSlice.actions
export default movieSlice.reducer
