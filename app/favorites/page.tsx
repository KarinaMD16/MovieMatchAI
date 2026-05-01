"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { DashboardHeader } from "@/components/dashboard/header"
import { MovieCatalog } from "@/components/dashboard/movie-catalog"
import { MovieModal } from "@/components/dashboard/movie-modal"
import { apiClient } from "@/lib/api"
import type { Movie } from "@/lib/types"

export default function FavoritesPage() {
    const router = useRouter()
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
    const [favorites, setFavorites] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDeleteMode, setIsDeleteMode] = useState(false)
    const [isMutatingFavorite, setIsMutatingFavorite] = useState(false)

    const loadFavorites = useCallback(async () => {
        const userId = apiClient.getUserId()

        if (!userId) {
            router.push("/")
            return
        }

        try {
            const data = await apiClient.getFavorites(userId)
            setFavorites(
                data.map((movie: Movie & { id?: string; favoriteId?: string }) => ({
                    ...movie,
                    favoriteId: movie.favoriteId ?? movie.id,
                }))
            )
            setError(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar favoritos")
            setFavorites([])
        } finally {
            setIsLoading(false)
        }
    }, [router])

    useEffect(() => {
        void loadFavorites()
    }, [loadFavorites])

    const handleMovieSelect = (movie: Movie) => {
        const movieData: Movie = {
            favoriteId: movie.favoriteId,
            tmdbMovieId: movie.tmdbMovieId,
            title: movie.title,
            overview: movie.overview,
            rating: typeof movie.rating === "string" ? parseFloat(movie.rating) : movie.rating,
            releaseDate: movie.releaseDate || new Date().toISOString(),
            posterUrl: movie.posterUrl,
            genres: movie.genres || [],
            director: movie.director,
            cast: movie.cast,
            runtime: movie.runtime,
            isFavorite: movie.isFavorite,
        }
        setSelectedMovie(movieData)
    }

    const handleFavoriteDelete = async (movie: Movie) => {
        const userId = apiClient.getUserId()

        if (!userId) {
            router.push("/")
            return
        }

        const favoriteId = movie.favoriteId
        if (!favoriteId) {
            toast("No se pudo obtener el ID del favorito")
            return
        }

        setIsMutatingFavorite(true)
        try {
            const response = await apiClient.deleteFavorite(userId, favoriteId)
            toast(response.message || "Película eliminada de favoritos")
            setSelectedMovie(null)
            await loadFavorites()
        } catch (err) {
            toast(err instanceof Error ? err.message : "Error al eliminar favorito")
        } finally {
            setIsMutatingFavorite(false)
        }
    }

    const handleCatalogMovieSelect = async (movie: Movie) => {
        if (isMutatingFavorite) return

        if (isDeleteMode) {
            await handleFavoriteDelete(movie)
            return
        }

        handleMovieSelect(movie)
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center gap-3">
                    <h1 className="text-4xl font-bold tracking-tight">Mis Favoritos</h1>
                    <button
                        type="button"
                        onClick={() => setIsDeleteMode((current) => !current)}
                        disabled={isMutatingFavorite}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${isDeleteMode
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        <Trash2 className="h-4 w-4" />
                        {isDeleteMode ? "Salir de eliminar" : "Eliminar favoritos"}
                    </button>
                </div>

                {isDeleteMode && (
                    <p className="mb-6 text-sm text-muted-foreground">
                        Haz clic en una card para eliminarla de favoritos.
                    </p>
                )}

                {error && (
                    <div className="mb-6 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                        <p className="font-medium">Error al cargar favoritos</p>
                        <p className="mt-1 text-sm">{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="space-y-4 text-center">
                            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <p className="text-muted-foreground">Cargando tus películas favoritas...</p>
                        </div>
                    </div>
                ) : favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Heart className="mb-4 h-16 w-16 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold">No tienes películas favoritas</h3>
                        <p className="mt-2 text-muted-foreground">Agrega películas a tus favoritos para verlas aquí</p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="mt-6 rounded-lg bg-primary px-6 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Ver películas
                        </button>
                    </div>
                ) : (
                    <MovieCatalog
                        movies={favorites}
                        searchQuery=""
                        onMovieSelect={handleCatalogMovieSelect}
                        isDeleteMode={isDeleteMode}
                    />
                )}
            </main>

            <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
        </div>
    )
}
