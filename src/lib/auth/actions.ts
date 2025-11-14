'use server'

import { createClient } from '../supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import prisma from '../prisma'

export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Ensure user exists in database
  if (data.user) {
    await ensureUserExists(data.user.id, data.user.email!)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// Helper function to ensure user exists in Prisma database
async function ensureUserExists(userId: string, email: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      // Create user with USER role by default
      await prisma.user.create({
        data: {
          id: userId,
          email,
          role: 'USER',
        },
      })
    }
  } catch (err) {
    console.error('Error ensuring user exists:', err)
  }
}

export async function signInWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Check your email for the magic link!' }
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const supabase = await createClient()

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Failed to create user' }
  }

  // Create user in Prisma database
  try {
    await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        name,
        role: 'USER', // Default role, admin can change later
      },
    })
  } catch (err) {
    console.error('Error creating user in database:', err)
    return { error: 'Failed to create user profile' }
  }

  return { success: true, message: 'Account created successfully! Please check your email to verify your account.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function createUserAsAdmin(email: string, name: string, role: 'ADMIN' | 'USER') {
  // Use admin client with service role for user creation
  const { createAdminClient } = await import('../supabase/admin')
  const adminClient = createAdminClient()

  // Generate random password
  const password = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12)

  // Create auth user
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    console.error('Error creating user in Supabase Auth:', error)
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Failed to create user' }
  }

  // Create user in Prisma database
  try {
    await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        name,
        role,
      },
    })

    // Return the password so admin can share it with the user
    return {
      success: true,
      message: 'Kullanıcı oluşturuldu!',
      password, // Return password for admin to copy
      email
    }
  } catch (err) {
    console.error('Error creating user in database:', err)
    // If database creation fails, delete the auth user
    await adminClient.auth.admin.deleteUser(data.user.id)
    return { error: 'Failed to create user profile' }
  }
}
