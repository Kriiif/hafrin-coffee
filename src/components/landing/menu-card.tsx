import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export type MenuItem = {
  id: string
  title: string
  description: string
  price: string
  imageQuery: string
}

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <Card className="overflow-hidden h-full transition-transform duration-300 will-change-transform hover:-translate-y-1">
      <CardHeader className="p-0">
        <img
          src={`/${item.imageQuery}.png`}
          alt={item.title}
          className="h-40 w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-base">{item.title}</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button size="sm" className="ml-auto bg-secondary text-secondary-foreground hover:opacity-90">
          {item.price}
        </Button>
      </CardFooter>
    </Card>
  )
}
