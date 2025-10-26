"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type CartItem = {
  title: string
  quantity: number
  sugar: string
  ice: string
  additions: string[]
  price?: number
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item])
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
