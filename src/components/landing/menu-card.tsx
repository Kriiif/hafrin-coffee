"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export type MenuItem = {
  id: string
  title: string
  description: string
  price: string
  imageQuery: string
}

export function MenuCard({ item }: { item: MenuItem }) {
  const [quantity, setQuantity] = useState(1)
  const [sugar, setSugar] = useState("normal")
  const [ice, setIce] = useState("normal")
  const [additions, setAdditions] = useState<string[]>([])

  const toggleAddition = (value: string) => {
    setAdditions((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
    )
  }

  const handleConfirm = async () => {
  try {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: item.id,
        title: item.title,
        quantity,
        sugar,
        ice,
        additions,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error:", data);
      alert("Gagal kirim pesanan!");
      return;
    }

    alert("Pesanan berhasil dikirim!");
  } catch (err) {
    console.error("Fetch failed:", err);
    alert("Gagal mengirim pesanan (fetch error)");
  }
};

  return (
    <Card className="overflow-hidden h-full transition-transform duration-300 will-change-transform hover:-translate-y-1">
      <CardHeader className="p-0">
        <img
          src={`/${item.imageQuery}.png`}
          alt={item.title}
          className="h-60 w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-base">{item.title}</CardTitle>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{item.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="ml-auto bg-secondary text-secondary-foreground hover:opacity-90">
              {item.price}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Customize your {item.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Quantity */}
              <div className="flex items-center justify-between">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-24"
                />
              </div>

              {/* Sugar level */}
              <div>
                <Label>Sugar Level</Label>
                <Select value={sugar} onValueChange={setSugar}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select sugar level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less">Less</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ice level */}
              <div>
                <Label>Ice Level</Label>
                <Select value={ice} onValueChange={setIce}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select ice level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No Ice</SelectItem>
                    <SelectItem value="normal">Iced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Additions */}
              <div>
                <Label>Additions</Label>
                <div className="flex flex-col gap-2 mt-2">
                  {["Extra Shot", "Oat Milk"].map((addon) => (
                    <label key={addon} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={additions.includes(addon)}
                        onCheckedChange={() => toggleAddition(addon)}
                      />
                      {addon}
                    </label>
                  ))}
                </div>
              </div>
              <Button
                className="w-full bg-secondary text-secondary-foreground hover:opacity-90"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}