"use client"

import { useState, useTransition, useEffect } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Smile } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { login, signup } from "./action" // import server actions
import { createClient } from "@/utils/supabase/client"

type AuthResponse = {
  success: boolean
  message?: string
  firstLogin?: boolean
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const supabase = createClient()

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (data?.user) {
        router.replace("/") // Redirect to home
      }
    }
    checkUser()
  }, [router, supabase])


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const res: AuthResponse =
        mode === "login" ? await login(formData) : await signup(formData)

      if (!res.success) {
        toast.error(res.message || "Something went wrong.")
        return
      }

      toast.success(
        mode === "login"
          ? "Logged in successfully!"
          : "Account created! Please check your email to verify your account."
      )

      if (res.firstLogin) {
        router.push("/account")
      } else {
        router.push("/")
      }
    })
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`, // redirect after login
        },
      })
      if (error) throw error
      toast("Redirecting to Google...")
    } catch (err) {
      const error = err as Error
      toast.error(error.message || "Google sign-in failed")
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              {mode === "login" ? "Welcome Back" : "Create an Account"}
            </h2>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
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
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters.
              </p>
            </div>

            {/* Forgot Password Link */}
            {mode === "login" && (
              <a
                href="/auth/forgot-password"
                className="text text-blue-600 hover:underline mb-3 self-end"
              >
                Forgot password?
              </a>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {isPending
                ? mode === "login"
                  ? "Logging in..."
                  : "Signing up..."
                : mode === "login"
                  ? "Log in"
                  : "Sign up"}
            </Button>

            {/* OR Separator */}
            <div className="flex items-center gap-3 my-2">
              <hr className="flex-1 border-gray-400" />
              <span className="text-gray-500 text-sm">OR</span>
              <hr className="flex-1 border-gray-400" />
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <Smile size={18} />
              Continue with Google
            </Button>

            {/* Toggle */}
            <p className="text-center text-sm mt-3">
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
