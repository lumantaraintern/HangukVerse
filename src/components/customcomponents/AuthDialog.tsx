'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import type { AuthError, AuthResponse } from "@supabase/supabase-js"

export function AuthDialog({ onSuccess }: { onSuccess?: () => void }) {
  const supabase = createClient()
  const [open, setOpen] = useState(true)

  // Common form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  // Sign In
  const handleSignIn = async () => {
    try {
      const { error }: AuthResponse = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      toast.success("Signed in successfully!")
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      const error = err as AuthError
      console.error(error)
      toast.error(error.message || "Failed to sign in")
    }
  }

  // Sign Up (with username stored in user_metadata)
  const handleSignUp = async () => {
    try {
      const { error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: name }, // store username
        },
      })
      if (error) throw error

      toast.success("Account created successfully!")
      setOpen(false)
      onSuccess?.()
    } catch (err) {
      const error = err as AuthError
      console.error(error)
      toast.error(error.message || "Failed to sign up")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="signin" className="mt-4">
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleSignIn} className="bg-[#270157] text-white hover:bg-[#AD6BFF]">
                Sign In
              </Button>
            </div>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent value="signup" className="mt-4">
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleSignUp} className="bg-[#270157] text-white hover:bg-[#AD6BFF]">
                Sign Up
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
