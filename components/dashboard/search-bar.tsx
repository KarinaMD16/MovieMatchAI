"use client"

import { useState, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { Movie } from "@/lib/types"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onResults?: (movies: Movie[]) => void
  isLoading?: boolean
}

export function SearchBar({ value, onChange, onResults, isLoading }: SearchBarProps) {
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      onResults?.([])
      return
    }

    setIsSearching(true)
    try {
      const results = await apiClient.searchMovies(query)
      onResults(results)
    } catch (error) {
      console.error("Error searching:", error)
      onResults([])
    } finally {
      setIsSearching(false)
    }
  }, [onResults])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(value)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [value, performSearch])

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar peliculas por titulo, genero o director..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading || isSearching}
        className="w-full h-14 pl-12 pr-4 text-lg rounded-2xl border-2 border-muted bg-card shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-all"
      />
      {isSearching && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
