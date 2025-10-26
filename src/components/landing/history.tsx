"use client"

import React from 'react'
import { Navbar } from './navbar' 
import { Button } from '@/components/ui/button' 
// NEW: Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

type HistoryItem = {
  id: string;
  name: string;
  pic: string;
  price: number;
  quantity: number;
  sugar: string;
  ice: string;
  additions: string[];
}

type PastOrder = {
  id: string;
  date: string;
  items: HistoryItem[];
  totalAmount: number;
  status: string;
}

type HistoryItemRowProps = {
  item: HistoryItem;
}

// NEW: Helper component for clean modal rows
const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

function HistoryItemRow({ item }: HistoryItemRowProps) {
  const totalItemPrice = item.price * item.quantity;
  const options = [
    `Sugar: ${item.sugar}`,
    `Ice: ${item.ice}`,
    ...(item.additions.length > 0 ? [`Addition: ${item.additions.join(', ')}`] : [])
  ];

  return (
    // Used beige card color from History.png
    <div className="text-card-foreground rounded-lg p-4 flex"> 
      
      <div className="flex items-center space-x-4">
        <img 
          src={`/${item.pic}.png`} 
          alt={item.name}
          className="w-16 h-20 md:w-20 md:h-24 object-cover rounded-md flex-shrink-0" 
        />
        <div className="flex flex-col">
          <h3 className="text-md md:text-lg font-semibold text-foreground">{item.name}</h3>
          {options.map((opt, i) => (
             <p key={i} className="text-xs md:text-sm text-muted-foreground">
              -{opt}
            </p>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* Modified right side to match History.png */}
      <div className="flex items-center gap-4 md:gap-6">
        <span className="text-md md:text-lg font-bold text-foreground flex-shrink-0 w-28 text-right">
          {formatCurrency(totalItemPrice)}
        </span>
        
        {/* NEW: Replaced Button with a Dialog containing the Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="bg-green-600 text-white hover:bg-green-700 rounded-md"
            >
              Detail
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Order Detail</DialogTitle>
            </DialogHeader>

            {/* Modal Body */}
            <div className="grid gap-4 py-4">
              {/* Image and Name */}
              <div className="flex items-center space-x-4">
                <img
                  src={`/${item.pic}.png`}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.price)} / item
                  </p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2">
                <DetailRow label="Quantity" value={item.quantity} />
                <DetailRow label="Sugar" value={item.sugar} />
                <DetailRow label="Ice" value={item.ice} />
                <DetailRow
                  label="Additions"
                  value={item.additions.length > 0 ? item.additions.join(', ') : 'None'}
                />
                <hr className="my-2" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(totalItemPrice)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Dummy data for past orders
const DUMMY_ORDERS: PastOrder[] = [
  {
    id: "ORD-001",
    date: "2025-10-25",
    status: "Completed",
    totalAmount: 16000,
    items: [
      {
        id: "1a",
        name: "Cappucino",
        pic: "hafrin", // Use a real image name from your /public folder
        price: 8000,
        quantity: 2,
        sugar: "Normal",
        ice: "Normal",
        additions: []
      }
    ]
  },
  {
    id: "ORD-002",
    date: "2025-10-22",
    status: "Completed",
    totalAmount: 18000,
    items: [
      {
        id: "2a",
        name: "Cappucino",
        pic: "hafrin", // Use a real image name from your /public folder
        price: 8000,
        quantity: 1,
        sugar: "Less",
        ice: "Normal",
        additions: []
      },
      {
        id: "2b",
        name: "Matcha Latte",
        pic: "hafrin", // Use a real image name from your /public folder
        price: 10000,
        quantity: 1,
        sugar: "Normal",
        ice: "Less",
        additions: ["Oat Milk"]
      }
    ]
  }
];

export function History() {
  const orders = DUMMY_ORDERS;

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar bgClass="bg-background" /> 

      <main className="mx-auto max-w-4xl p-4 md:p-8 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You have no past orders.
          </div>
        ) : (

          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow">
                <div className="flex justify-between items-center pb-3 mb-3 border-b">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{order.id}</h2>
                    <p className="text-sm text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-foreground">{formatCurrency(order.totalAmount)}</span>
                    <p className="text-sm font-medium text-green-700">{order.status}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <HistoryItemRow
                      key={item.id}
                      item={item}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}