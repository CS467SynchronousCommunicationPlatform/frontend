/**
 * /app/login/actions.ts
 * Implements user login, logout and signup
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app
 */


'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login() {
  const supabase = await createClient()
  const origin = process.env.NODE_ENV === 'development' ? "http://localhost:3000" : "https://frontend-self-tau.vercel.app"
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect(data.url!)
}

export async function signout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}