"use server"

import prisma from "@/lib/prisma"

/**
 * Generate a username from email, with random numbers to ensure uniqueness
 */
function generateUsernameFromEmail(email: string) {
  const namePart = email.split("@")[0].replace(/\W/g, "") // remove special chars
  const randomNum = Math.floor(Math.random() * 10000)
  return `${namePart}${randomNum}`.toLowerCase()
}

/**
 * Generate a unique username by checking the database
 */
async function generateUniqueUsername(email: string) {
  let username = generateUsernameFromEmail(email)
  let exists = await prisma.profile.findUnique({ where: { username } })

  while (exists) {
    username = generateUsernameFromEmail(email)
    exists = await prisma.profile.findUnique({ where: { username } })
  }

  return username
}

/**
 * Create a profile for email/password signup
 */
export async function createProfile(
  userId: string,
  email: string,
  name?: string
) {
  // If profile already exists, do nothing
  const existing = await prisma.profile.findUnique({ where: { id: userId } })
  if (existing) return existing

  // Generate a unique username
  const username = await generateUniqueUsername(email)

  return prisma.profile.create({
    data: {
      id: userId,
      name,
      username,
    },
  })
}

/**
 * Create or get profile for Google OAuth login
 */
export async function createOrGetProfile(
  userId: string,
  email?: string,
  name?: string
) {
  if (!email) throw new Error("Email is required")

  // Check if profile exists
  let profile = await prisma.profile.findUnique({ where: { id: userId } })
  if (profile) return profile

  // Generate a unique username
  const username = await generateUniqueUsername(email)

  profile = await prisma.profile.create({
    data: {
      id: userId,
      name,
      username,
    },
  })

  return profile
}
