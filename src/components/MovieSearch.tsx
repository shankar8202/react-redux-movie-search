"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchMovies, fetchDefaultMovies, setSearchTerm, setCurrentPage, clearMovies } from "../lib/movieSlice"
import MovieCard from "./MovieCard"
import Pagination from "./Pagination"
import LoadingSpinner from "./LoadingSpinner"
import type { AppDispatch, RootState } from "@/lib/store"

const MovieSearch: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { movies, loading, error, searchTerm, currentPage, totalPages, defaultMoviesLoaded, defaultMovieQuery } =
        useSelector((state: RootState) => state.movies)

    const [inputValue, setInputValue] = useState("")


    useEffect(() => {
        if (!searchTerm && !defaultMoviesLoaded && movies.length === 0) {
            dispatch(fetchDefaultMovies({ page: 1 }))
        }
    }, [dispatch, searchTerm, defaultMoviesLoaded, movies.length])


    useEffect(() => {
        if (searchTerm.trim()) {
            dispatch(fetchMovies({ searchTerm, page: currentPage }))
        }
    }, [dispatch, searchTerm, currentPage])


    useEffect(() => {
        if (!searchTerm && defaultMoviesLoaded && defaultMovieQuery && currentPage > 1) {
            dispatch(fetchDefaultMovies({ page: currentPage, query: defaultMovieQuery }))
        }
    }, [dispatch, searchTerm, currentPage, defaultMovieQuery])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (inputValue.trim()) {
            dispatch(setSearchTerm(inputValue.trim()))
            dispatch(setCurrentPage(1))
        } else {
            dispatch(clearMovies())
            dispatch(setSearchTerm(""))
            dispatch(setCurrentPage(1))

        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        if (!e.target.value.trim()) {
            dispatch(clearMovies())
            dispatch(setSearchTerm(""))
            dispatch(setCurrentPage(1))

        }
    }

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page))
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className="movie-search-container">
            <header className="search-header">
                <h1>Movie Search</h1>
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Search for movies..."
                            className="search-input"
                        />
                        <button type="submit" className="search-button">
                            Search
                        </button>
                    </div>
                </form>
            </header>

            <main className="search-content">
                {loading && <LoadingSpinner />}

                {error && (
                    <div className="error-message">
                        <p>Error: {error}</p>
                    </div>
                )}

                {!loading && !error && movies.length > 0 && (
                    <>
                        <div className="results-info">
                            <p>
                                {searchTerm
                                    ? `Showing results for "${searchTerm}" - Page ${currentPage} of ${totalPages}`
                                    : `Popular Movies: ${defaultMovieQuery} - Page ${currentPage} of ${totalPages}`}
                            </p>
                        </div>

                        <div className="movies-grid">
                            {movies.map((movie) => (
                                <MovieCard key={movie.imdbID} movie={movie} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        )}
                    </>
                )}

                {!loading && !error && searchTerm && movies.length === 0 && (
                    <div className="no-results">
                        <p>No movies found for "{searchTerm}"</p>
                    </div>
                )}

                {!loading && !error && !searchTerm && movies.length === 0 && !defaultMoviesLoaded && (
                    <div className="welcome-message">
                        <p>Loading popular movies...</p>
                    </div>
                )}
            </main>
        </div>
    )
}

export default MovieSearch
