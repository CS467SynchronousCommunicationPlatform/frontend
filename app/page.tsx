// page.tsx
import React from 'react';
import Chat from "@/components/Chat";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MessageProps, ChannelMessage, Channel } from '@/utils/types/types'


/**
 *  The URL to the backend REST API
 */
const api: string = process.env.NEXT_PUBLIC_BACKEND_API!
const apiHeaders = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
}

/**
 * The entry point to our application.
 * Handles authentication and data fetching.
 * @returns Chat component for real-time messaging
 */
export default async function Page() {
  // Check if user is authenticated
  const supabase = await createClient()
  const {
      data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
      return redirect('/login')
  }

  // fetch previous messages
  // for now hardcoding general
  let previous: MessageProps[] = []
  try {
    const response = await fetch(api + '/channels/4/messages', apiHeaders)

    if (response.ok) {
      const data = await response.json()
      // Map the differences between api and socket formats
      previous = data.map((message: ChannelMessage) => ({
        user: message.users.display_name,
        body: message.body,
        timestamp: message.created_at
      }))
    }
  } catch (error) {
    console.log('Failed to receive general chat messages: ', error)
    //redirect('/error')
  }
  // fetch channels
  let channels: Channel[] = []
  try {
    const chanResponse = await fetch(api + `/users/${user.id}/channels`, apiHeaders)
    if (chanResponse.ok) {
      const chanData = await chanResponse.json()
      channels = chanData
    }
  } catch (error) {
    console.log('Failed to get channels for user: ', error)
  }

  return (
    <Chat user={user} previousMessages={previous} channels={channels}/>
  )
}
