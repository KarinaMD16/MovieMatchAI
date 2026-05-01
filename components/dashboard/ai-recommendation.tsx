"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Sparkles, Send, Wand2 } from "lucide-react"
import { apiClient } from "@/lib/api"

const examplePrompts = [
  "Peliculas de ciencia ficcion con giros inesperados",
  "Comedias romanticas de los 90s",
  "Thrillers psicologicos que te hacen pensar",
  "Peliculas animadas para toda la familia",
]

export function AIRecommendation() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.getRecommendations({
        prompt: prompt.trim(),
      })

      setRecommendations(response.explanation)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener recomendaciones")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

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
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Prueba con estas ideas:
            </p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example) => (
                <button
                  key={example}
                  onClick={() => handleExampleClick(example)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
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

        {recommendations && (
          <div className="p-4 rounded-xl bg-background/80 border border-border">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Respuesta de la IA</p>
                <p className="text-muted-foreground">{recommendations}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
