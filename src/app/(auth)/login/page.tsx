"use client"
export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createProfile, createOrGetProfile } from "@/lib/profile" // server actions
import type { AuthError, AuthResponse } from "@supabase/supabase-js"



export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // --- Detect existing session (handles Google redirect) ---
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        try {
          // Create or get profile
          await createOrGetProfile(
            session.user.id,
            session.user.email || undefined,
            session.user.user_metadata?.full_name || undefined
          )
        } catch (err) {

          console.error("Failed to create profile:", err)
        }

        router.push("/")
        toast.success("Logged in successfully!")
      }
    }

    checkSession()
  }, [router])

  // --- Email/Password Login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push("/")
      toast.success("Logged in successfully!")
    } catch (err) {
      const error = err as AuthError 
      toast.error(error.message || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  // --- Email/Password Signup ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error

      if (data.user) {
        await createProfile(data.user.id, email, name) // server action inserts profile
      }

      toast.success("Account created!")
      toast.info("Please check your email to confirm your account.")
      setMode("login")
    } catch (err) {
      const error = err as AuthError
      toast.error(error.message || "Failed to sign up")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // --- Forgot Password ---
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first")
      return
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success("Password reset email sent!")
    } catch (err ) {
      const error = err as AuthError

      toast.error(error.message || "Failed to send reset email")
    }
  }

  // --- Google OAuth Login ---
  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
      // Profile creation will be handled after redirect in useEffect
    } catch (err) {
      const error = err as AuthError
      toast.error(error.message || "Failed to login with Google")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      <div className="relative w-full aspect-[1440/1024] bg-[#0b0813]">
        {/* Background Image */}
        <Image
          src="/LoginSignUp.png"
          alt="Background"
          fill
          priority
          className="absolute inset-0 object-contain object-top"
        />

        {/* Form Container */}
        <div className="absolute top-1/3 left-8 z-10 w-full max-w-md p-8 bg-white/20 backdrop-blur-md shadow-lg rounded-2xl md:ml-16">
          <form
            onSubmit={mode === "login" ? handleLogin : handleSignup}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {mode === "login" ? "Welcome Back" : "Create an Account"}
            </h2>

            {/* Username (signup only) */}
            {mode === "signup" && (
              <div className="flex flex-col gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && password.length < 8 && (
                <p className="text-xs text-red-500">
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            {/* Forgot password */}
            {mode === "login" && (
              <div className="text-right text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading
                ? mode === "login"
                  ? "Logging in..."
                  : "Signing up..."
                : mode === "login"
                  ? "Log in"
                  : "Sign up"}
            </Button>

            {/* Google OAuth Button */}
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
              {mode === "login" ? "Log in with Google" : "Sign up with Google"}
            </Button>

            {/* Toggle link */}
            <p className="text-center text-sm">
              {mode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-blue-600 underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-blue-600 underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
