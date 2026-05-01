"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Star, Clock, Calendar, User, Play, Heart, X } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { Movie } from "@/lib/types"
import { toast } from "sonner"

interface MovieModalProps {
  movie: Movie | null
  onClose: () => void
}

export function MovieModal({ movie, onClose }: MovieModalProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isAddingFavorite, setIsAddingFavorite] = useState(false)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleAddToFavorites = async () => {
    if (!movie) return

    const userId = apiClient.getUserId()
    if (!userId) {
      toast("Debes iniciar sesión para agregar a favoritos")
      return
    }

    setIsAddingFavorite(true)
    try {
      const movieId = movie.tmdbMovieId

      if (!movieId) {
        throw new Error("No se pudo obtener el ID de la película")
      }

      const response = await apiClient.addToFavorites(userId, Number(movieId))


      if (response) {
        setIsFavorited(true)
        toast("¡Película agregada a favoritos!")
      }
    } catch (error) {
      setIsFavorited(false)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      toast(`Error al agregar a favoritos: ${errorMessage}`)
    } finally {
      setIsAddingFavorite(false)
    }
  }

  if (!movie) return null

  return (
    <Dialog open={!!movie} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] lg:w-[90vw] max-w-7xl p-0 overflow-hidden bg-card max-h-[90vh] flex flex-col border-none">  <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Cerrar</span>
        </button>

        <div className="flex flex-col lg:flex-row overflow-hidden">
          {/* Backdrop y Poster - Mobile/Tablet */}
          <div className="lg:hidden relative h-56 md:h-72 w-full">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          </div>

          {/* Poster - Desktop */}
          <div className="hidden lg:flex flex-col items-center pt-6 px-6 shrink-0">
            <div className="relative w-48 aspect-2/3 rounded-xl overflow-hidden shadow-xl">
              <Image
                src={movie.posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Contenido - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-balance">
                  {movie.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {typeof movie.rating === 'string'
                        ? parseFloat(movie.rating).toFixed(1)
                        : (movie.rating as number).toFixed(1)
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Sinopsis</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {movie.overview}
                </p>
              </div>


              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6">
                <Button className="gap-2 flex-1 md:flex-none">
                  <Play className="w-4 h-4" />
                  Ver trailer
                </Button>
                <Button
                  variant={isFavorited ? "default" : "outline"}
                  className="gap-2 flex-1 md:flex-none"
                  onClick={handleAddToFavorites}
                  disabled={isAddingFavorite}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isAddingFavorite ? "Agregando..." : isFavorited ? "Agregado a favoritos" : "Agregar a favoritos"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
