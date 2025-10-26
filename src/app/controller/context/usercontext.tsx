"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  _id: string
  username: string
  name: string
  email: string
}

type UserContextType = {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  requireAuth: () => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch("/controller/user")
      const data = await res.json() as { success: boolean; user?: User; error?: string }
      
      if (data.success && data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("Auth check failed:", err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("/controller/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json() as { success: boolean; user?: User; error?: string }

      if (!data.success) {
        throw new Error(data.error || "Login failed")
      }

      if (!data.user) {
        throw new Error("No user data received")
      }

      setUser(data.user)
    } catch (err) {
      console.error("Login failed:", err)
      throw err
    }
  }

  const logout = async () => {
    try {
      await fetch("/controller/user", { method: "DELETE" })
      setUser(null)
      router.push("/")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const requireAuth = () => {
    if (!loading && !user) {
      router.push("/login")
      return false
    }
    return true
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, requireAuth }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("useUser must be used within a UserProvider")
  return context
}