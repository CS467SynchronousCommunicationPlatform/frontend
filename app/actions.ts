'use client'

import { createClient } from "@supabase/supabase-js"

// Set dev URL or production URL to redirect to
const isDevEnv = process.env.NEXT_PUBLIC_ENV === 'development';
const urlRedirect = isDevEnv ? 'http://localhost:3000/chat' : 'https://frontend-self-tau.vercel.app/'

const googleOauth = async () => {
    const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: urlRedirect,
        },
      })
}

export default googleOauth;
  