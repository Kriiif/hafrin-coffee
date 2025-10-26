"use client"

import Link from "next/link"
import { ShoppingCart, User } from "lucide-react" 
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="#" className="font-semibold tracking-wide">
          <img src="/loghaf.png" alt="Hafrin Coffee Logo" className="h-16 w-24 object-contain" />
          <span className="sr-only">Hafrin Coffee</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            className="h-12 w-12" 
          >
            <ShoppingCart className="h-7 w-7" /> 
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