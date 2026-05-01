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
  message: string
  accessToken: string
  access_token?: string
  user: {
    id: string
    email: string
    name: string
  }
}

interface AddFavoriteResponse {
  id: string
  tmdbMovieId: number
  title: string
  posterUrl: string
  overview: string
  rating: string
  createdAt: string
}

class APIClient {
  private token: string | null = null
  private userId: string | null = null
  private userName: string | null = null
  private userEmail: string | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("authToken")
      this.userId = localStorage.getItem("userId")
      this.userName = localStorage.getItem("userName")
      this.userEmail = localStorage.getItem("userEmail")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token)
    }
  }

  setUserId(userId: string) {
    this.userId = userId
    if (typeof window !== "undefined") {
      localStorage.setItem("userId", userId)
    }
  }

  setUserInfo(userId: string, userName: string, userEmail: string) {
    this.setUserId(userId)
    this.userName = userName
    this.userEmail = userEmail
    if (typeof window !== "undefined") {
      localStorage.setItem("userName", userName)
      localStorage.setItem("userEmail", userEmail)
    }
  }

  getUserId(): string | null {
    return this.userId
  }

  getUserName(): string | null {
    return this.userName
  }

  getUserEmail(): string | null {
    return this.userEmail
  }

  clearToken() {
    this.token = null
    this.userId = null
    this.userName = null
    this.userEmail = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userId")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
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
    const token = response.accessToken || (response as any).access_token
    if (!token) {
      throw new Error("No token received from server")
    }
    this.setToken(token)
    this.setUserInfo(response.user.id, response.user.name, response.user.email)
    return response
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (response.user?.id) {
      this.setUserInfo(response.user.id, response.user.name, response.user.email)
    }
    return response
  }

  async getMovies(): Promise<Movie[]> {
    const userId = this.getUserId()
    if (!userId) {
      throw new Error("User ID is required")
    }
    return this.request<Movie[]>(`/tmdb/popular?userId=${userId}`)
  }

  async getMovieDetails(id: number): Promise<Movie> {
    const userId = this.getUserId()
    if (!userId) {
      throw new Error("User ID is required")
    }

    return this.request<Movie>(`/tmdb/movie/${id}/${userId}`)
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

  async getSuggestions(): Promise<{ total: number; suggestions: string[] }> {
    return this.request<{ total: number; suggestions: string[] }>("/recommendations/suggestions")
  }

  async getFavorites(userId: string): Promise<Movie[]> {
    if (!userId) {
      throw new Error("User ID is required")
    }
    return this.request<Movie[]>(`/favorites/${userId}`)
  }

  async addToFavorites(userId: string, tmdbMovieId: number): Promise<{ message?: string }> {
    if (!userId) {
      throw new Error("User ID is required")
    }
    if (!tmdbMovieId) {
      throw new Error("Movie ID is required")
    }

    const endpoint = `/favorites/${userId}`
    const body = JSON.stringify({ tmdbMovieId })

    console.log("POST to favorites - Endpoint:", endpoint, "Body:", body)

    return this.request<{ message?: string }>(endpoint, {
      method: "POST",
      body: body,
    })
  }

  async deleteFavorite(userId: string, favoriteId: string): Promise<{ message?: string }> {
    if (!userId) {
      throw new Error("User ID is required")
    }
    if (!favoriteId) {
      throw new Error("Favorite ID is required")
    }

    return this.request<{ message?: string }>(`/favorites/${userId}/${favoriteId}`, {
      method: "DELETE",
    })
  }

  logout() {
    this.clearToken()
  }
}

export const apiClient = new APIClient()
