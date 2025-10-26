"use client";

import { useCart } from "@/context/cartcontext"

export function Cart() {
  const { cart, clearCart } = useCart()

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  const handleCheckout = async () => {
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total }),
    })
    const data = await res.json()

    if (res.ok) {
      alert("Checkout berhasil!")
      clearCart()
    } else {
      alert("Checkout gagal!")
      console.error(data)
    }
  }

  return (
    <div>
      <h1>Keranjang</h1>
      {cart.length === 0 && <p>Keranjang kosong</p>}

      {cart.map((item, i) => (
        <div key={i}>
          <p>{item.title} × {item.quantity}</p>
          <p>Sugar: {item.sugar}, Ice: {item.ice}</p>
          <p>Additions: {item.additions.join(", ") || "none"}</p>
        </div>
      ))}

      <p>Total: Rp{total.toLocaleString("id-ID")}</p>

      {cart.length > 0 && (
        <button onClick={handleCheckout}>Checkout</button>
      )}
    </div>
  )
}