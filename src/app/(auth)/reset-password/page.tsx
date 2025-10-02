"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { AuthError } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
    

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success("Password updated! You can now log in.")
    } catch (err) {
      const error = err as AuthError
      toast.error(error.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-sm"
      >
        <h2 className="text-xl font-bold text-center">Reset Password</h2>
        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </section>
  )
}
