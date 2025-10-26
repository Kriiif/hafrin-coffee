"use client"

import React, { useState } from 'react'
import { Navbar } from './navbar'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2 } from 'lucide-react'

// Helper for formatting currency
const formatCurrency = (amount: number) => {
  return `Rp${amount.toLocaleString('id-ID')}`
}

// Data for one item
const itemData = {
  id: 1,
  name: 'Cappucino',
  options: ['-Sugar', '-Ice', '-Addition'],
  basePrice: 8000,
  image: 'https://via.placeholder.com/80x100/FADADD/000?text=Klarins' // Placeholder
}

function CartItemRow() {
  const [quantity, setQuantity] = useState(1)
  const totalItemPrice = itemData.basePrice * quantity

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 flex border">
      
      <div className="flex items-start space-x-4">
        <Checkbox id={`item-${itemData.id}`} className="flex-shrink-0 mt-1" />
        <img 
          src={itemData.image} 
          alt={itemData.name} 
          className="w-16 h-20 md:w-20 md:h-24 object-cover rounded-md flex-shrink-0" 
        />
        <div className="flex flex-col">
          <h3 className="text-md md:text-lg font-semibold text-foreground">{itemData.name}</h3>
          <span className="text-sm font-medium text-muted-foreground">{formatCurrency(itemData.basePrice)}</span> 
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {itemData.options.join(', ')}
          </p>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col items-end justify-between md:flex-row md:items-center md:gap-4 lg:gap-6">
        
        <div className="flex items-center flex-shrink-0">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-r-none border-secondary"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input 
            type="text" 
            value={quantity} 
            readOnly 
            className="h-8 w-10 text-center bg-background rounded-none focus-visible:ring-0 p-0" 
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-l-none border-secondary"
            onClick={() => setQuantity(q => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <span className="text-md md:text-lg font-bold text-foreground flex-shrink-0 my-2 md:my-0">
          {formatCurrency(totalItemPrice)}
        </span>
        
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export function Cart() {
  const totalAmount = 379000; 

  return (
    // --- UPDATED BACKGROUND COLOR HERE ---
    <div className="min-h-screen bg-muted/40">
      <Navbar bgClass="bg-background" />

      <main className="mx-auto max-w-4xl p-4 md:p-8 space-y-4">
        
        <div className="bg-card text-card-foreground rounded-lg p-4 flex items-center space-x-3 border">
          <Checkbox id="selectAll" />
          <label
            htmlFor="selectAll"
            className="text-md font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Pilih Semua
          </label>
        </div>

        <CartItemRow />
        <CartItemRow />

        <div className="bg-card text-card-foreground rounded-lg p-4 flex justify-between items-center mt-6 border">
          <span className="text-xl font-bold text-foreground">Total :</span>
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</span>
            <Button className="bg-secondary text-secondary-foreground px-6 py-2 rounded-md font-semibold hover:bg-secondary/90 text-base">
              Checkout
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}