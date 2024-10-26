'use client'

import { createClient } from "@supabase/supabase-js"

const googleOauth = async () => {
    const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `http://localhost:3000/chat`,
        },
      })
}

export default googleOauth;


  