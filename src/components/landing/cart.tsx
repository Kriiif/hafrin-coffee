"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from './navbar'
import { Checkbox } from '@/components/ui/checkbox'
import { useUser } from '@/app/controller/context/usercontext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/app/controller/context/cartcontext'
import type { CartItem } from '@/app/controller/context/cartcontext'
import { toast } from 'sonner'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

type CartItemProps = {
  item: CartItem;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

function CartItemRow({ item, checked, onCheckedChange, onQuantityChange, onRemove }: CartItemProps) {
  const totalItemPrice = item.idProduct.price * item.quantity
  const options = [
    `Sugar: ${item.sugar}`,
    `Ice: ${item.ice}`,
    ...(item.additions.length > 0 ? [item.additions.join(', ')] : [])
  ]

  return (
    <div className="bg-card text-card-foreground rounded-lg p-4 flex border">
      
      <div className="flex items-center space-x-4">
        <Checkbox 
          id={`item-${item.idProduct._id}`} 
          checked={checked}
          onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
          className="flex-shrink-0" 
        />
        <img 
          src={`/${item.idProduct.pic}.png`}
          alt={item.idProduct.name}
          className="w-16 h-20 md:w-20 md:h-24 object-cover rounded-md flex-shrink-0" 
        />
        <div className="flex flex-col">
          <h3 className="text-md md:text-lg font-semibold text-foreground">{item.idProduct.name}</h3>
          <span className="text-sm font-medium text-muted-foreground">{formatCurrency(item.idProduct.price)}</span> 
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            {options.join(', ')}
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
            onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input 
            type="text" 
            value={item.quantity} 
            readOnly 
            className="h-8 w-12 text-center bg-acent rounded-none border-x-0 border-y border-secondary focus-visible:ring-0 p-0"  
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-l-none border-secondary"
            onClick={() => onQuantityChange(item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <span className="text-md md:text-lg font-bold text-foreground flex-shrink-0 my-2 md:my-0 w-28 text-right">
          {formatCurrency(totalItemPrice)}
        </span>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export function Cart() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      toast.error("Please login to view your cart");
      router.push("/login");
    }
  }, [user, userLoading, router]);

  const getItemUniqueId = (item: CartItem) => {
    // Create a stable unique identifier by sorting additions consistently
    const sortedAdditions = [...item.additions].sort();
    return `${item.idProduct._id}-${item.sugar}-${item.ice}-${sortedAdditions.join(',')}`; 
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? cart.map(item => getItemUniqueId(item)) : []);
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to checkout");
      return;
    }

    try {
  const itemsToCheckout = cart.filter(item => selectedItems.includes(getItemUniqueId(item)));
  const subtotal = itemsToCheckout.reduce((sum, item) => sum + item.idProduct.price * item.quantity, 0);

      const res = await fetch("/controller/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: itemsToCheckout,
          totalAmount: subtotal
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Checkout failed" })) as { message?: string };
        throw new Error(error.message || "Checkout failed");
      }

      // Remove checked out items from cart
      await Promise.all(selectedItems.map(id => removeItem(id)));
      setSelectedItems([]);
      toast.success("Checkout berhasil!");
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err instanceof Error ? err.message : "Checkout gagal!");
    }
  };

  const totalAmount = cart
    .filter(item => selectedItems.includes(getItemUniqueId(item)))
    .reduce((sum, item) => sum + item.idProduct.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar bgClass="bg-background" />

      <main className="mx-auto max-w-4xl p-4 md:p-8 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-card animate-pulse h-32 rounded-lg"/>
            ))}
          </div>
        ) : (
          <>
            <div className="bg-card text-card-foreground rounded-lg p-4 flex items-center justify-between border">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="selectAll" 
                  checked={selectedItems.length === cart.length && cart.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label
                  htmlFor="selectAll"
                  className="text-md font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Pilih Semua
                </label>
              </div>
              {selectedItems.length > 0 && (
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={async () => {
                    try {
                      const itemsToDelete = cart.filter(item => selectedItems.includes(getItemUniqueId(item)));
                      
                      // Process deletions sequentially to avoid race conditions
                      for (const item of itemsToDelete) {
                        await removeItem(
                          item.idProduct._id,
                          {
                            sugar: item.sugar,
                            ice: item.ice,
                            additions: [...item.additions].sort() // Sort to ensure consistent comparison
                          }
                        );
                      }
                      
                      setSelectedItems([]);
                      toast.success("Selected items removed");
                    } catch (error) {
                      console.error('Error removing selected items:', error);
                      toast.error('Failed to remove some items');
                    }
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Your cart is empty
              </div>
            ) : (
              cart.map((item) => (
                <CartItemRow
                  key={getItemUniqueId(item)}
                  item={item}
                  checked={selectedItems.includes(getItemUniqueId(item))}
                  onCheckedChange={(checked) => {
                    setSelectedItems(prev =>
                      checked
                        ? [...prev, getItemUniqueId(item)]
                        : prev.filter(id => id !== getItemUniqueId(item))
                    );
                  }}
                  onQuantityChange={(quantity) => updateQuantity(
                    item.idProduct._id, 
                    quantity,
                    {
                      sugar: item.sugar,
                      ice: item.ice,
                      additions: item.additions
                    }
                  )}
                  onRemove={() => removeItem(item.idProduct._id, {
                    sugar: item.sugar,
                    ice: item.ice,
                    additions: item.additions
                  })}
                />
              ))
            )}

            {cart.length > 0 && (
              <div className="bg-card text-card-foreground rounded-lg p-4 flex justify-between items-center mt-6 border">
                <span className="text-xl font-bold text-foreground">Total :</span>
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-foreground">{formatCurrency(totalAmount)}</span>
                  <Button 
                    className="bg-secondary text-secondary-foreground px-6 py-2 rounded-md font-semibold hover:bg-secondary/90 text-base"
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}