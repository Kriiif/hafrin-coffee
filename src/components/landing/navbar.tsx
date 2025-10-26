"use client"

import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"

// 1. Define the prop type
interface NavbarProps {
  bgClass?: string
}

// 2. Add the { bgClass } prop.
//    We set a default value to your original blur style.
export function Navbar({ 
  bgClass = "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
}: NavbarProps) {
  return (
    // 3. Use the bgClass prop here instead of a hard-coded color
    <header className={`sticky top-0 z-50 border-b ${bgClass}`}>
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">
          <img src="/loghaf.png" alt="Hafrin Coffee Logo" className="h-16 w-24 object-contain" />
          <span className="sr-only">Hafrin Coffee</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="h-12 w-12"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-7 w-7" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Profile"
            className="h-12 w-12"
          >
            <User className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </header>
  )
}