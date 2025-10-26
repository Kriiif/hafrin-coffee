"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "sonner"

export type CartItem = {
  quantity: number
  sugar: string
  ice: string
  additions: string[]
  idProduct: {
    _id: string
    name: string
    price: number
    pic: string
  }
}

type CartContextType = {
  cart: CartItem[]
  loading: boolean
  addToCart: (item: CartItem) => Promise<void>
  updateQuantity: (idProduct: string, quantity: number) => Promise<void>
  removeItem: (idProduct: string) => Promise<void>
  clearCart: () => Promise<void>
  total: number
}

// For development, we'll use a fixed user ID
// In production, this should come from your auth system
const DEMO_USER_ID = "68fe26ccef947ad3ac0b44b8"; // Test user ID

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.idProduct.price * item.quantity, 0)

  // Fetch cart on mount
  useEffect(() => {
    fetchCart()
  }, [])

  type ApiResponse = {
    success: boolean;
    cart?: {
      _id: string;
      idUser: string;
      items: CartItem[];
      createdAt: string;
      updatedAt: string;
    };
    error?: string;
  }

  const fetchCart = async () => {
    try {
      setLoading(true)
      console.log("🔍 Fetching cart for user:", DEMO_USER_ID)
      
      const res = await fetch(`/controller/cart?idUser=${DEMO_USER_ID}`)
      const data = await res.json() as ApiResponse
      
      console.log("📦 Cart data received:", data)
      
      if (data.success && data.cart?.items) {
        setCart(data.cart.items)
        console.log("✅ Cart updated with items:", data.cart.items)
      } else {
        console.log("ℹ️ No items in cart or cart not found")
        setCart([])
      }
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err)
      toast.error("Failed to load cart")
      setCart([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (item: CartItem) => {
    try {
      setLoading(true)
      // Always add as new item and let the server handle combinations
      const res = await fetch("/controller/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUser: DEMO_USER_ID,
          idProduct: item.idProduct._id,
          pic: item.idProduct.pic || item.idProduct.name.toLowerCase(),
          quantity: item.quantity,
          customizations: {
            sugar: item.sugar,
            ice: item.ice,
            additions: item.additions,
          }
        }),
      });

      const data = await res.json() as ApiResponse;

      if (!res.ok) {
        throw new Error(data.error || "Failed to add item");
      }

      if (data.success && data.cart) {
        await fetchCart(); // Refresh cart data
        toast.success("Added to cart!");
      } else {
        throw new Error(data.error || "Failed to add item");
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (idProduct: string, quantity: number) => {
    try {
      setLoading(true)
      const res = await fetch("/controller/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUser: DEMO_USER_ID,
          idProduct,
          quantity,
        }),
      })
      const data = await res.json() as ApiResponse
      if (data.success) {
        await fetchCart()
      } else {
        throw new Error(data.error || "Failed to update quantity")
      }
    } catch (err) {
      console.error("Failed to update quantity:", err)
      toast.error("Failed to update quantity")
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (idProduct: string) => {
    try {
      setLoading(true)
      const res = await fetch("/controller/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUser: DEMO_USER_ID,
          idProduct,
        }),
      })
      const data = await res.json() as ApiResponse
      if (data.success) {
        await fetchCart()
        toast.success("Item removed")
      } else {
        throw new Error(data.error || "Failed to remove item")
      }
    } catch (err) {
      console.error("Failed to remove item:", err)
      toast.error("Failed to remove item")
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    try {
      setLoading(true)
      const res = await fetch("/controller/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUser: DEMO_USER_ID,
          deleteCart: true,
        }),
      })
      const data = await res.json() as ApiResponse
      if (data.success) {
        setCart([])
        toast.success("Cart cleared")
      } else {
        throw new Error(data.error || "Failed to clear cart")
      }
    } catch (err) {
      console.error("Failed to clear cart:", err)
      toast.error("Failed to clear cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      total,
      addToCart, 
      updateQuantity,
      removeItem, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
