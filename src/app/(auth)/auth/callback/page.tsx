
"use client"


import { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { createOrGetProfile } from "@/lib/profile"
import { useRouter } from "next/navigation"





export default function OAuthCallbackPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        await createOrGetProfile(
          session.user.id,
          session.user.email || undefined,
          session.user.user_metadata?.full_name || undefined
        )
      }

      router.push("/") // redirect to homepage after profile creation
    }

    handleRedirect()
  }, [router, supabase.auth])

  return <p>Logging you in...</p>
}
