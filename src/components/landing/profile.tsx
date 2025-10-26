"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Navbar } from './navbar' 
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar' 

export function ProfilePage() {
  // Placeholder state for form fields
  const [namaAsli, setNamaAsli] = useState('abraham')
  const [username, setUsername] = useState('basmalah')
  const [password, setPassword] = useState('********') 
  const [gender, setGender] = useState('Male')
  const [nomorHp, setNomorHp] = useState('081317718146')
  const [alamat, setAlamat] = useState('Johar')
  const [currentEmail, setCurrentEmail] = useState('basmalah@gmail.com')
  const [newEmail, setNewEmail] = useState('') 
  const [message, setMessage] = useState('') 

  const handleSaveChanges = (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
    
    console.log({
      namaAsli,
      username,
      password, 
      gender,
      nomorHp,
      alamat,
      currentEmail,
      newEmail,
    })
    setMessage('Profile updated successfully!')
    setNewEmail('')
  }

  const handleAddEmail = () => {
    if (newEmail) {
      console.log('Adding new email:', newEmail)
      setMessage(`"${newEmail}" added as a new email (placeholder action).`)
      setCurrentEmail(newEmail);
      setNewEmail('');
    } else {
      setMessage('Please enter an email address to add.')
    }
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar bgClass="bg-background" />

      <main className="flex justify-center py-16 md:py-24 px-4">
        <div className="w-full max-w-4xl bg-card text-card-foreground rounded-lg p-6 md:p-8 border shadow-lg space-y-8">
          
        
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-28 w-28 border-2 border-primary">
              <AvatarImage src="/placeholder-avatar.jpg" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
         
          </div>

       
          <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
           
            <div className="space-y-2">
              <Label htmlFor="namaAsli">Nama Asli</Label>
              <Input
                id="namaAsli"
                type="text"
                placeholder="Your First Name"
                value={namaAsli}
                onChange={(e) => setNamaAsli(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Your First Name" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

          
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                type="text"
                placeholder="Your First Name" 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

          
            <div className="space-y-2">
              <Label htmlFor="nomorHp">Nomor Hp</Label>
              <Input
                id="nomorHp"
                type="tel"
                placeholder="Your First Name" 
                value={nomorHp}
                onChange={(e) => setNomorHp(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                type="text"
                placeholder="Your First Name" 
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </div>

           
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="email">My Email Address</Label>
              <div className="flex items-center justify-between bg-muted p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-foreground">{currentEmail}</p>
                </div>
                
              </div>

              <div className="flex space-x-2 mt-4">
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="+Add Email Address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  onClick={handleAddEmail} 
                  variant="outline"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Add
                </Button>
              </div>
            </div>

            {message && (
              <p className="md:col-span-2 text-sm font-medium text-green-600 mt-4">
                {message}
              </p>
            )}

          
            <div className="md:col-span-2 flex justify-end mt-6">
              <Button 
                type="submit"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3"
              >
                Save Change
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}