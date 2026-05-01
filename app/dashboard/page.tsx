"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { SearchBar } from "@/components/dashboard/search-bar"
import { MovieCatalog } from "@/components/dashboard/movie-catalog"
import { AIRecommendation } from "@/components/dashboard/ai-recommendation"
import { MovieModal } from "@/components/dashboard/movie-modal"
import { apiClient } from "@/lib/api"
import type { Movie } from "@/lib/types"

export default function DashboardPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null)

  const loadMovies = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.getMovies()
      setMovies(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar películas")
      setMovies([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadMovies()
  }, [loadMovies])

  const handleMovieSelect = (movie: Movie | any) => {
    // Convertir RecommendedMovie a Movie si es necesario
    const movieData: Movie = {
      tmdbMovieId: movie.tmdbMovieId || movie.id,
      title: movie.title,
      overview: movie.overview,
      rating: typeof movie.rating === 'string' ? parseFloat(movie.rating) : movie.rating,
      releaseDate: movie.releaseDate || new Date().toISOString(),
      posterUrl: movie.posterUrl || movie.posterPath,
      genres: movie.genres || [],
      director: movie.director,
      cast: movie.cast,
      runtime: movie.runtime,
    }
    setSelectedMovie(movieData)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Search Section */}
        <section className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onResults={setSearchResults}
            isLoading={isLoading}
          />
        </section>

        {/* AI Recommendation Section */}
        <AIRecommendation onMovieSelect={handleMovieSelect} />

        {/* Movie Catalog */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
            <p className="font-medium">Error al cargar películas</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
              <p className="text-muted-foreground">Cargando películas...</p>
            </div>
          </div>
        ) : (
          <div>

            <h2 className="text-2xl font-bold tracking-tight">
              {searchQuery ? "Resultados de busqueda" : "Peliculas populares"}
            </h2>
            <MovieCatalog
              movies={searchQuery.trim() ? (searchResults || []) : movies}
              searchQuery={searchQuery}
              onMovieSelect={handleMovieSelect}
            />
          </div>
        )}
      </main>

      {/* Movie Detail Modal */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onFavoritesChange={() => {
          void loadMovies()
        }}
      />
    </div>
  )
}
