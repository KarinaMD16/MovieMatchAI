"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { MovieCatalog } from "@/components/dashboard/movie-catalog"
import { MovieModal } from "@/components/dashboard/movie-modal"
import { apiClient } from "@/lib/api"
import type { Movie } from "@/lib/types"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFavorites = async () => {
      const userId = apiClient.getUserId()

      if (!userId) {
        router.push("/")
        return
      }

      try {
        const data = await apiClient.getFavorites(userId)
        setFavorites(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar favoritos")
        setFavorites([])
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [router])

  const handleMovieSelect = (movie: Movie | any) => {
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

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Mis Favoritos</h1>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-lg">
            <p className="font-medium">Error al cargar favoritos</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
              <p className="text-muted-foreground">Cargando tus películas favoritas...</p>
            </div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No tienes películas favoritas</h3>
            <p className="text-muted-foreground mt-2">Agrega películas a tus favoritos para verlas aquí</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver películas
            </button>
          </div>
        ) : (
          <MovieCatalog
            movies={favorites}
            searchQuery=""
            onMovieSelect={handleMovieSelect}
          />
        )}
      </main>

      {/* Movie Detail Modal */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  )
}
