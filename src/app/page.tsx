"use client"

import { useEffect } from 'react'
import { useUser } from "@/app/controller/context/usercontext"
import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { MenusSection } from "@/components/landing/menus-section"
import { BrandSection } from "@/components/landing/brand-section"
import { SiteFooter } from "@/components/landing/footer"

export default function Page() {
  const { user } = useUser() // Cek status login

  // Detect if Midtrans redirected to the root with order params (e.g. ?order_id=...&transaction_status=settlement)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('order_id') || params.get('orderId') || params.get('id');
      const txStatus = params.get('transaction_status') || params.get('transactionStatus') || params.get('status');

      // If present, navigate to our server-side /checkout/finish which will POST to callback and redirect to the proper page
      if (orderId && txStatus) {
        const path = window.location.pathname || '/';
        if (!path.startsWith('/checkout/finish') && !path.startsWith('/Successpay') && !path.startsWith('/Errorpay')) {
          window.location.replace(`/checkout/finish${window.location.search}`);
        }
      }
    } catch (e) {
      console.warn('Midtrans redirect handler failed', e);
    }
  }, []);

  return (
    <main>
      <Navbar />
      
      {user ? (
        // --- TAMPILAN DASHBOARD (USER) ---
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Sapaan User */}
           <section className="bg-secondary/10 py-10 mb-8">
              <div className="mx-auto max-w-6xl px-4">
                 <h1 className="text-3xl font-bold">
                    Welcome back, {user.username || "Code Mate"}! 👋
                 </h1>
              </div>
           </section>
           
           {/* Langsung ke Menu */}
           <MenusSection />
        </div>
      ) : (
        // --- TAMPILAN LANDING PAGE (GUEST) ---
        <>
          <Hero />
          <BrandSection />
          <MenusSection />
        </>
      )}

      <SiteFooter />
    </main>
  )
}