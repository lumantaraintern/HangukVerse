'use client'

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { AuthDialog } from "@/components/customcomponents/AuthDialog"
import { createClient } from "@/utils/supabase/client"
import type { User, AuthError } from "@supabase/supabase-js"

function NavigationBar() {
  const supabase = createClient()
  const [showAuth, setShowAuth] = useState(false)
  const [userLabel, setUserLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (!error && data?.user) {
        const user: User = data.user
        // Use username from user_metadata if available, fallback to email
        const username = (user.user_metadata?.username as string | undefined) ?? null
        setUserLabel(username ?? user.email ?? null)
      } else {
        setUserLabel(null)
      }
    } catch {
      setUserLabel(null)
    }
  }, [supabase])

  useEffect(() => {
    loadSession()
  }, [loadSession])

  const handleLogout = useCallback(async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      await loadSession()
    } catch (err) {
      const error = err as AuthError
      console.error("Logout failed:", error.message)
    } finally {
      setLoading(false)
    }
  }, [supabase, loadSession])

  return (
    <nav className="w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="text-base sm:text-lg font-bold">MyApp</div>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <Button className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 sm:h-10 rounded-[30px] px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap">
            Community
          </Button>
          <Button className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 sm:h-10 rounded-[30px] px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap">
            Pro Member
          </Button>

          {userLabel ? (
            <>
              <Button className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 sm:h-10 rounded-[30px] px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap">
                {userLabel}
              </Button>
              <Button
                onClick={handleLogout}
                disabled={loading}
                className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 sm:h-10 rounded-[30px] px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap"
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setShowAuth(true)}
              className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 sm:h-10 rounded-[30px] px-4 sm:px-6 text-xs sm:text-sm whitespace-nowrap"
            >
              Login / Sign Up
            </Button>
          )}
        </div>
      </div>

      {showAuth && (
        <AuthDialog
          onSuccess={async () => {
            setShowAuth(false)
            await loadSession()
          }}
        />
      )}
    </nav>
  )
}

export default NavigationBar
