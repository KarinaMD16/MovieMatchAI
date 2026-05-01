"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/auth/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Film, Sparkles } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleAuthSuccess = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
              <Film className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Movie Match AI</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-balance">
              Descubre tu proxima pelicula favorita
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-md leading-relaxed">
              Recomendaciones personalizadas impulsadas por inteligencia artificial que entienden tus gustos.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">IA Personalizada</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                <span className="text-sm font-medium">+10,000 Peliculas</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-primary-foreground/60">
            Creado con amor para los amantes del cine
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
              <Film className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Movie Match AI</span>
          </div>
          <div className="flex-1 lg:flex-none" />
          <ThemeToggle />
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
              </h2>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Ingresa tus credenciales para continuar" 
                  : "Registrate para empezar a descubrir peliculas"}
              </p>
            </div>

            <AuthForm 
              mode={isLogin ? "login" : "register"} 
              onSuccess={handleAuthSuccess}
            />

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin 
                  ? "¿No tienes cuenta? Registrate" 
                  : "¿Ya tienes cuenta? Inicia sesion"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
