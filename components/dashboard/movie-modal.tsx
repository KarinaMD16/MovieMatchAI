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
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-card max-h-[90vh] flex flex-col w-[95vw]">
        <button
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
                    <span className="font-medium">{movie.rating.toFixed(1)}</span>
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
                <Button variant="outline" className="gap-2 flex-1 md:flex-none">
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
