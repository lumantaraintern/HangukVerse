'use server'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { success: false, message: error.message }
  }

  const user = authData.user
  if (!user) {
    return { success: false, message: 'User not found.' }
  }

  // --- Check if email is confirmed ---
  const emailVerified = Boolean(user.email_confirmed_at)
  if (!emailVerified) {
    return { success: false, message: 'Please verify your email before logging in.' }
  }

  // --- Optional: Detect first login ---
  const firstLogin = user.created_at === user.last_sign_in_at

  return { success: true, firstLogin }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { success: false, message: error.message }
  }

  return { success: true, message: 'Signup successful! Please check your email to verify your account.' }
}
