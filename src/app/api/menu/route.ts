import { NextResponse } from "next/server"

export async function GET() {
  const menu = [
    {
      id: "latte01",
      title: "Caffè Latte",
      description: "Smooth espresso with steamed milk",
      price: "Rp25.000",
      imageQuery: "latte",
    },
    {
      id: "matcha01",
      title: "Matcha Latte",
      description: "Green tea with creamy milk",
      price: "Rp27.000",
      imageQuery: "matcha",
    },
    {
      id: "americano01",
      title: "Americano",
      description: "Classic espresso diluted with hot water",
      price: "Rp22.000",
      imageQuery: "americano",
    },
  ]

  // Next.js otomatis akan ubah jadi response JSON
  return NextResponse.json(menu)
}