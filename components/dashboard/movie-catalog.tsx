"use client"

import { useMemo } from "react"
import { MovieCard } from "./movie-card"
import type { Movie } from "@/lib/types"

interface MovieCatalogProps {
  movies: Movie[]
  searchQuery: string
  onMovieSelect: (movie: Movie) => void
}

export function MovieCatalog({ movies, searchQuery, onMovieSelect }: MovieCatalogProps) {
  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return movies

    const query = searchQuery.toLowerCase()
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(query) 
    )
  }, [searchQuery, movies])

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {filteredMovies.length} {filteredMovies.length === 1 ? "pelicula encontrada" : "peliculas encontradas"}
          </p>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">No se encontraron peliculas</h3>
          <p className="text-muted-foreground mt-1">
            Intenta con otro termino de busqueda
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.tmdbMovieId}
              movie={movie}
              onClick={() => onMovieSelect(movie)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
