export interface Movie {
  id: number
  title: string
  overview: string
  posterPath: string
  backdropPath: string
  releaseDate: string
  rating: number
  genres: string[]
  runtime?: number
  director?: string
  cast?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface AIRecommendationRequest {
  prompt: string
}

export interface AIRecommendationResponse {
  movies: Movie[]
  explanation: string
}
