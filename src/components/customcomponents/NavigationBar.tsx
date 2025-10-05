'use client'

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { Menu, X, ChevronDown } from "lucide-react"
import type { User, AuthError } from "@supabase/supabase-js"


function NavigationBar() {
  const supabase = createClient()
  const [userLabel, setUserLabel] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const loadSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      console.log("User data:", data)
      if (!error && data?.user) {
        const user: User = data.user
        const username = (user.user_metadata?.name as string | undefined) ?? (user.user_metadata?.full_name as string | undefined)
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
      window.location.href = "/login"
    } catch (err) {
      const error = err as AuthError
      console.error("Logout failed:", error.message)
    } finally {
      setLoading(false)
    }
  }, [supabase, loadSession])

  return (
    <nav className={`w-full shadow-md font-kalnia text-white`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-lg sm:text-xl font-bold cursor-pointer text-[#fff]" onClick={() => window.location.href = '/'}>
          HangukVerse
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            className="bg-[#630063] text-white hover:bg-[#DB31DB] h-9 rounded-[30px] px-5 text-sm"
            onClick={() => window.location.href = '/community'}
          >
            Community
          </Button>

          <Button
            className="bg-[#630063] text-white hover:bg-[#DB31DB] h-9 rounded-[30px] px-5 text-sm"
          >
            Pro Member
          </Button>

          {userLabel ? (
            <div className="relative">
              <Button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-[#630063] text-white hover:bg-[#DB31DB] h-9 rounded-[30px] px-5 text-sm flex items-center gap-1"
              >
                {userLabel}
                <ChevronDown className="w-4 h-4" />
              </Button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#bd00bd] rounded-lg shadow-lg border border-gray-200 z-20 flex flex-col">
                  <Button
                    onClick={() => window.location.href = '/account'}
                    className="bg-[#630063] text-white hover:bg-[#DB31DB] h-9 rounded-[30px] m-2 px-4 text-sm"
                  >
                    My Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    disabled={loading}
                    className="bg-red-600 text-white hover:bg-red-700 h-9 rounded-[30px] m-2 px-4 text-sm"
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => (window.location.href = '/login')}
              className="bg-[#630063] text-white hover:bg-[#DB31DB] h-9 rounded-[30px] px-5 text-sm"
            >
              Login / Sign Up
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#630063]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-3 pb-4 bg-white border-t border-gray-200">
          <Button
            className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 rounded-[30px] px-5 text-sm w-[90%]"
            onClick={() => window.location.href = '/community'}
          >
            Community
          </Button>

          <Button
            className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 rounded-[30px] px-5 text-sm w-[90%]"
          >
            Pro Member
          </Button>

          {userLabel ? (
            <>
              <Button
                onClick={() => window.location.href = '/account'}
                className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 rounded-[30px] px-5 text-sm w-[90%]"
              >
                My Profile
              </Button>
              <Button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-600 text-white hover:bg-red-700 h-9 rounded-[30px] px-5 text-sm w-[90%]"
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => (window.location.href = '/login')}
              className="bg-[#630063] text-black hover:bg-[#DB31DB] h-9 rounded-[30px] px-5 text-sm w-[90%]"
            >
              Login / Sign Up
            </Button>
          )}
        </div>
      )}
    </nav>
  )
}

export default NavigationBar
