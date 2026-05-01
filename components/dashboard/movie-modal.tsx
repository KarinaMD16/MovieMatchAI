"use client"

import { useEffect } from "react"
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
import type { Movie } from "@/lib/types"

interface MovieModalProps {
  movie: Movie | null
  onClose: () => void
}

export function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  if (!movie) return null

  return (
    <Dialog open={!!movie} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card">
        {/* Backdrop */}
        <div className="relative h-56 md:h-72">
          <Image
            src={movie.backdropPath}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        <div className="relative px-6 pb-6 -mt-20 md:-mt-24">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="relative w-32 md:w-40 aspect-[2/3] rounded-xl overflow-hidden shadow-xl shrink-0 mx-auto md:mx-0">
              <Image
                src={movie.posterPath}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
                  {movie.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detalles de la pelicula {movie.title}
                </DialogDescription>
              </DialogHeader>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{movie.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                {movie.runtime && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                  </div>
                )}
                {movie.director && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{movie.director}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview}
              </p>

              {/* Cast */}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Reparto principal</h4>
                  <p className="text-sm text-muted-foreground">
                    {movie.cast.join(", ")}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <Button className="gap-2">
                  <Play className="w-4 h-4" />
                  Ver trailer
                </Button>
                <Button variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Agregar a favoritos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
