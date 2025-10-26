"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  User,
  History,
  Info,
  BookMarked,
  LogOut,
  LogIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  bgClass?: string
}

export function Navbar({
  bgClass = "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
}: NavbarProps) {
  // 2. Initialize the router
  const router = useRouter()

  // 3. Create a handler function for logging out
  const handleLogout = () => {
    // ---
    // TODO: Add your actual logout logic here
    // (e.g., clearing localStorage, removing cookies, etc.)
    // Example: localStorage.removeItem('user-token')
    // ---
    console.log("Logging out...")

    // After logic, redirect to the Login page
    router.push("/login") // <-- CHANGED: Use lowercase "/login"
  }

  return (
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Profile"
                className="h-12 w-12"
              >
                <User className="h-7 w-7" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/history">
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/#about">
                    <Info className="mr-2 h-4 w-4" />
                    <span>About Us</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#menus">
                    <BookMarked className="mr-2 h-4 w-4" />
                    <span>Menu</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 4. Add the onClick handler to the Log Out item */}
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                {/* <-- CHANGED: Removed the empty <Link> tag */}
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}