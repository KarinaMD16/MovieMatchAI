import type { Movie, AIRecommendationRequest, AIRecommendationResponse } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  message: string
  user: {
    id: string
    email: string
    name: string
    password: string
    createdAt: string
  }
}
interface LoginResponse {
  message: string,
  accessToken: string
  user: {
    id: string
    email: string
    name: string
  }
}

class APIClient {
  private token: string | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("authToken")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }
    return headers
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_URL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `API Error: ${response.status}`)
    }

    return response.json()
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
    this.setToken(response.accessToken)
    return response
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response
  }

  async getMovies(): Promise<Movie[]> {
    return this.request<Movie[]>("/tmdb/popular")
  }

  async getMovieDetails(id: number): Promise<Movie> {
    return this.request<Movie>(`/tmdb/movie/${id}`)
  }

  async getRecommendations(
    request: AIRecommendationRequest
  ): Promise<AIRecommendationResponse> {
    return this.request<AIRecommendationResponse>("/recommendations", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async searchMovies(query: string): Promise<Movie[]> {
    return this.request<Movie[]>(`/tmdb/search?query=${encodeURIComponent(query)}`)
  }

  logout() {
    this.clearToken()
  }
}

export const apiClient = new APIClient()
