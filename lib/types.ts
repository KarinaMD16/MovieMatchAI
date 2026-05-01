export interface Movie {
  tmdbMovieId: number
  title: string
  overview: string
  rating: string | number
  releaseDate: string
  posterUrl: string
  genres?: string[]
  director?: string
  cast?: string[]
  runtime?: number
}

export interface RecommendedMovie {
  tmdbMovieId: number
  title: string
  overview: string
  rating: string
  releaseDate: string
  posterUrl: string
  reason: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface AIRecommendationRequest {
  preferences: string
}


export interface AIRecommendationResponse {
  interpretedPreferences: {
    genres: string[]
    keywords: string[]
    similarTitles: string[]
    isNew: boolean
    tone: string
    explanation: string
  }
  total: number
  recommendations: RecommendedMovie[]
  originalPreferences: string
}
