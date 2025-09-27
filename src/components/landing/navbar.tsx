"use client"

import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="#" className="font-semibold tracking-wide">
          <span className="text-lg">hafrin</span>
          <span className="text-primary">.COFFEE</span>
          <span className="sr-only">Hafrin Coffee</span>
        </Link>
        <nav aria-label="Main" className="text-sm">
          <ul className="flex items-center gap-6">
            <li>
              <a href="#home" className="hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a href="#menus" className="hover:text-primary">
                Menu
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-primary">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
