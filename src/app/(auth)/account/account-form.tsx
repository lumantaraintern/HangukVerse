'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import AvatarUpload from './avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AccountForm({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()
      if (error && status !== 406) throw error
      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      toast.error('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null
    fullname: string | null
    website: string | null
    avatar_url: string | null
  }) {
    try {
      setLoading(true)
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      toast.success('Profile updated!')
      router.push('/')
    } catch (error) {
      const errorMessage = error as Error || 'Unknown error'
      toast.error('Error updating the data!', { description: errorMessage.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#0b0813] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-6">
        <CardHeader>
          <CardTitle className="text-3xl text-[#630063] text-center">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <AvatarUpload
              uid={user?.id ?? null}
              url={avatar_url}
              size={150}
              onUpload={(url) => {
                setAvatarUrl(url)
                updateProfile({ fullname, username, website, avatar_url: url })
              }}
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="text"
                value={user?.email ?? ''}
                disabled
                className="bg-white/20 text-white border-none"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="fullName" className="text-white">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullname || ''}
                onChange={(e) => setFullname(e.target.value)}
                className="bg-white/20 text-white border-none"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                type="text"
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/20 text-white border-none"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="website" className="text-white">Website</Label>
              <Input
                id="website"
                type="url"
                value={website || ''}
                onChange={(e) => setWebsite(e.target.value)}
                className="bg-white/20 text-white border-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-[#630063] text-black hover:bg-[#DB31DB] rounded-[30px] flex-1"
              onClick={() => updateProfile({ fullname, username, website, avatar_url })}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </Button>

            <form action="/auth/signout" method="post" className="flex-1">
              <Button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700 rounded-[30px] w-full"
              >
                Sign Out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
