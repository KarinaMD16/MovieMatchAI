"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Film, User, Settings, LogOut, Heart, Search } from "lucide-react"
import { apiClient } from "@/lib/api"

export function DashboardHeader() {
  const router = useRouter()
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userInitial, setUserInitial] = useState<string>("U")

  useEffect(() => {
    const name = apiClient.getUserName()
    const email = apiClient.getUserEmail()
    setUserName(name)
    setUserEmail(email)
    if (name) {
      setUserInitial(name.charAt(0).toUpperCase())
    }
  }, [])

  const handleLogout = () => {
    apiClient.logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Movie Match AI</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Button
            variant="ghost"
            className="text-foreground/80 hover:text-foreground"
            onClick={() => router.push("/dashboard")}
          >
            <Search className="w-4 h-4 mr-2" />
            Explorar
          </Button>
          <Button
            variant="ghost"
            className="text-foreground/80 hover:text-foreground"
            onClick={() => router.push("/favorites")}
          >
            <Heart className="w-4 h-4 mr-2" />
            Favoritos
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatar-placeholder.jpg" alt="Usuario" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{userName || "Usuario"}</p>
                  <p className="text-sm text-muted-foreground">
                    {userEmail || "usuario@email.com"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/favorites")}>
                <Heart className="mr-2 h-4 w-4" />
                <span>Mis favoritos</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuracion</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
