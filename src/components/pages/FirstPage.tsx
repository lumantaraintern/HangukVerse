'use client'

import NavigationBar from "@/components/customcomponents/NavigationBar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { AuthDialog } from "@/components/customcomponents/AuthDialog"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"

type FirstPageProps = { onNext: () => void }

export default function FirstPage({ onNext }: FirstPageProps) {
  const supabase = createClient()
  const [openDoors, setOpenDoors] = useState(false)
  const [hideDoors, setHideDoors] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Optional: show info toast if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser()
      const user: User | null = data?.user ?? null
      if (user?.email) {
        setUserEmail(user.email)
        toast(`Already signed in as ${user.email}`)
        setShowAuth(false)
      }
    }
    checkSession()
  }, [supabase])

  const animateDoorsThen = useCallback((after: () => void) => {
    setOpenDoors(true)
    setTimeout(() => {
      setHideDoors(true)
      after()
    }, 1200)
  }, [])

  const handleNext = useCallback(async () => {
    if (isChecking) return
    setIsChecking(true)

    animateDoorsThen(async () => {
      try {
        const { data } = await supabase.auth.getUser()
        const isSignedIn = Boolean(data?.user?.email)
        if (isSignedIn) {
          setShowAuth(false)
          onNext()
        } else {
          toast.error("Please sign in first to continue")
          setShowAuth(true)
        }
      } finally {
        setIsChecking(false)
      }
    })
  }, [animateDoorsThen, isChecking, onNext, supabase])

  const handleAuthSuccess = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    const user: User | null = data?.user ?? null
    if (user?.email) {
      setUserEmail(user.email)
      setShowAuth(false)
      onNext()
    } else {
      toast.error(
        "Sign-in not confirmed. A verification email has been sent, please try again"
      )
      setShowAuth(true)
    }
  }, [onNext, supabase])

  return (
    <section className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      <div className="relative w-full aspect-[1440/1024] bg-[#0b0813]">
        {/* Background */}
        <Image
          src="/Hangukverse_bg_Nav1.jpg"
          alt=""
          fill
          className="absolute inset-0 object-contain object-top z-30"
        />
        {/* Exterior */}
        <Image
          src="/exterior.png"
          alt=""
          fill
          className="absolute inset-0 object-contain object-center z-20"
        />

        {/* Doors */}
        <div className="absolute inset-0 overflow-x-hidden">
          {!hideDoors && (
            <motion.img
              src="/DOORL.png"
              alt=""
              initial={{ x: "0%" }}
              animate={openDoors ? { x: "-10%" } : { x: "0%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-contain object-center block pointer-events-none z-[15]"
            />
          )}
          {!hideDoors && (
            <motion.img
              src="/DOORR.png"
              alt=""
              initial={{ x: "0%" }}
              animate={openDoors ? { x: "10%" } : { x: "0%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-contain object-center block pointer-events-none z-[15]"
            />
          )}
        </div>

        {/* Interior */}
        <Image
          src="/interior.png"
          alt=""
          fill
          className="absolute inset-0 object-contain object-center z-10"
        />
        <Image
          src="/liftdoorl.png"
          alt=""
          fill
          className="absolute inset-0 object-contain object-center z-5"
        />
        <Image
          src="/liftdoorr.png"
          alt=""
          fill
          className="absolute inset-0 object-contain object-center z-5"
        />

        {/* Foreground nav */}
        <div className="absolute inset-x-0 top-0 z-40">
          <NavigationBar />
        </div>

        {/* Click Me Button */}
        {!showAuth && (
          <div
            className="absolute z-50"
            style={{
              left: "50%",
              top: "65%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Button
              className="bg-[#270157] text-white hover:bg-[#AD6BFF] w-40 h-8 rounded-[30px] font-light text-[14px] opacity-60"
              onClick={handleNext}
              disabled={isChecking}
            >
              {isChecking ? "Please wait..." : "Click Me"}
            </Button>
          </div>
        )}

        {/* Auth Dialog */}
        {showAuth && <AuthDialog onSuccess={handleAuthSuccess} />}
      </div>
    </section>
  )
}
