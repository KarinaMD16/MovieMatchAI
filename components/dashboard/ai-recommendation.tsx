"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Sparkles, Send, Wand2, Star, ChevronDown, ChevronUp } from "lucide-react"
import { apiClient } from "@/lib/api"
import type { AIRecommendationResponse, RecommendedMovie } from "@/lib/types"

interface AIRecommendationProps {
  onMovieSelect?: (movie: RecommendedMovie) => void
}

export function AIRecommendation({ onMovieSelect }: AIRecommendationProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<AIRecommendationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(true)

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await apiClient.getRecommendations({
        preferences: prompt.trim(),
      })
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener recomendaciones")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const data = await apiClient.getSuggestions()
        setSuggestions(data.suggestions)
      } catch (err) {
        console.error("Error loading suggestions:", err)
        setSuggestions([])
      } finally {
        setSuggestionsLoading(false)
      }
    }

    loadSuggestions()
  }, [])

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-primary/20">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Recomendaciones con IA
            </h2>
            <p className="text-muted-foreground mt-1">
              Describe el tipo de pelicula que buscas y nuestra IA encontrara las mejores opciones para ti
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Quiero ver una pelicula emocionante con accion y efectos visuales impresionantes, preferiblemente de ciencia ficcion..."
              className="min-h-[120px] pr-24 resize-none bg-background/50 border-primary/20 focus-visible:ring-primary"
              disabled={isLoading}
            />
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              size="sm"
              className="absolute bottom-3 right-3"
            >
              {isLoading ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </div>

          {/* Example prompts */}
          <div className="space-y-2">
            
            {suggestionsLoading ? (
              <div className="flex items-center gap-2">
                <Spinner className="w-4 h-4" />
                <p className="text-sm text-muted-foreground">Cargando sugerencias...</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Prueba con estas ideas:
                  </p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(suggestion)}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50 text-left line-clamp-2"
                    title={suggestion}
                  >
                    {suggestion.length > 50 ? suggestion.substring(0, 50) + "..." : suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Response */}
        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/20 shrink-0">
                <span className="text-lg">⚠️</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {response && (
          <div className="space-y-4">
            {/* AI Analysis */}
            <div className="p-4 rounded-xl bg-background/80 border border-border">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Análisis de la IA</p>
                  <p className="text-sm text-muted-foreground">{response.interpretedPreferences.explanation}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Géneros</p>
                    <p className="font-medium">{response.interpretedPreferences.genres.join(", ")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Palabras clave</p>
                    <p className="font-medium">{response.interpretedPreferences.keywords.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Movies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Recomendaciones ({response.total})</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isMinimized ? (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Expandir
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Minimizar
                    </>
                  )}
                </Button>
              </div>

              {!isMinimized && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {response.recommendations.map((movie: RecommendedMovie) => (
                    <div
                      key={movie.tmdbMovieId}
                      className="group cursor-pointer"
                      onClick={() => onMovieSelect?.(movie)}
                    >
                      <div className="relative overflow-hidden rounded-lg mb-2">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-xs text-white text-center px-2">{movie.reason}</p>
                        </div>
                      </div>
                      <h4 className="text-xs font-medium truncate">{movie.title}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">{movie.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
