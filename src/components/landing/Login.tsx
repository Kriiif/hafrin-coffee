"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Navbar } from './navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('') 

    // TODO: Add your fetch logic here
    // Example:
    // if (username === "user" && password === "pass") {
    //   setMessage('Login successful! Redirecting...')
    //   window.location.href = '/'
    // } else {
    //   setMessage('Invalid username or password.')
    // }
    console.log({ username, password })
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar bgClass="bg-background" />

      <main className="flex items-center justify-center py-16 md:py-24 px-4">
        <div className="w-full max-w-md bg-card text-card-foreground rounded-lg p-6 md:p-8 border shadow-lg space-y-6">
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Login
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back! Login to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your_username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {message && (
              <p className="text-sm font-medium text-destructive">
                {message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}