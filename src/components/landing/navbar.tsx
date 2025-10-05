"use client"

import Link from "next/link"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="#" className="font-semibold tracking-wide">
          <img src="/loghaf.png" alt="Hafrin Coffee Logo" className="h-16 w-24 object-contain" />
          <span className="sr-only">Hafrin Coffee</span>
        </Link>
        <nav aria-label="Main" className="text-sm">
          <ul className="flex items-center gap-6">
            <li>
              <a href="#home" className="hover:text-primary font-semibold text-lg">
                Home
              </a>
            </li>
            <li>
              <a href="#menus" className="hover:text-primary font-semibold text-lg">
                Menu
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-primary font-semibold text-lg">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary font-semibold text-lg">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}