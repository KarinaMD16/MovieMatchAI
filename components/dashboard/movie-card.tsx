"use client"

import Image from "next/image"
import { Heart, Star, Trash2 } from "lucide-react"
import type { Movie } from "@/lib/types"

interface MovieCardProps {
    movie: Movie
    onClick: () => void
    isDeleteMode?: boolean
}

export function MovieCard({ movie, onClick, isDeleteMode = false }: MovieCardProps) {
    const displayRating = typeof movie.rating === "string" ? parseFloat(movie.rating) : movie.rating

    return (
        <button
            onClick={onClick}
            className={`group relative flex flex-col overflow-hidden rounded-xl text-left transition-all focus:outline-none focus-visible:ring-2 ${isDeleteMode
                ? "opacity-80 hover:opacity-100 focus-visible:ring-destructive"
                : "focus-visible:ring-primary"
                }`}
        >
            <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-muted">
                <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />

                <div
                    className={`absolute inset-0 bg-linear-to-t transition-opacity duration-300 ${isDeleteMode
                        ? "from-destructive/80 via-destructive/30 to-transparent opacity-0 group-hover:opacity-100"
                        : "from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100"
                        }`}
                >
                    {isDeleteMode && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20">
                                <Trash2 className="h-4 w-4" />
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center gap-1.5 text-sm">
                            {isDeleteMode ? (
                                <span className="font-semibold text-destructive-foreground">Haz clic para eliminar de favoritos</span>
                            ) : (
                                <>
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{displayRating.toFixed(1)}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                    {movie.isFavorite && <Heart className="h-3 w-3 fill-red-500 text-red-500" />}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {displayRating.toFixed(1)}
                </div>
            </div>

            <div className="space-y-1 pt-3">
                <h3 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
                    {movie.title}
                </h3>
                <p className="text-xs text-muted-foreground">{new Date(movie.releaseDate).getFullYear()}</p>
            </div>
        </button>
    )
}
