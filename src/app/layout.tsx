import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Hafrin Coffee',
  description: 'Hafrin coffee'
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}