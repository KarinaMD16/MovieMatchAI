"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { SearchBar } from "@/components/dashboard/search-bar"
import { MovieCatalog } from "@/components/dashboard/movie-catalog"
import { AIRecommendation } from "@/components/dashboard/ai-recommendation"
import { MovieModal } from "@/components/dashboard/movie-modal"
import type { Movie } from "@/lib/types"

export default function DashboardPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Search Section */}
        <section className="space-y-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </section>

        {/* AI Recommendation Section */}
        <AIRecommendation />

        {/* Movie Catalog */}
        <MovieCatalog 
          searchQuery={searchQuery}
          onMovieSelect={setSelectedMovie}
        />
      </main>

      {/* Movie Detail Modal */}
      <MovieModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />
    </div>
  )
}
