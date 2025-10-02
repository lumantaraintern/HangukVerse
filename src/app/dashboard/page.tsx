'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'


export default function PrivatePage() {
  const supabase = createClient()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Fetch user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/login') // redirect if not logged in
      } else {
        setUserEmail(data.user.email ?? null)
      }
    }
    getUser()
  }, [supabase, router])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Private Page</h2>
        <p className="text-gray-600 mb-6">
          {userEmail ? `Welcome, ${userEmail}!` : 'Loading...'}
        </p>
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
