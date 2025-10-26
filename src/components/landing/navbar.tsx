"use client"

import Link from "next/link"
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
            {/* 3. Set a consistent width */}
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* 4. Group account-related items */}
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
              {/* 5. Group navigation items */}
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
              {/* 6. Add icon to logout */}
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/Login">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log In</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}