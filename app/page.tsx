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

  // fetch all channels the user is subscribed to
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

  // fetch previous messages
  // k: channel_id v: an array of all messages received
  const previousMessages = new Map<number, MessageProps[]>
  for (const channel of channels) {
    try {
      const response = await fetch(`${api}/channels/${channel.id}/messages`, apiHeaders)
      if (response.ok) {
        const data = await response.json()
        // Map the differences between api and socket formats
        const messages: MessageProps[] = data.map((message: ChannelMessage) => ({
          user: message.users.display_name,
          body: message.body,
          channel_id: channel.id,
          timestamp: message.created_at
        }))
        previousMessages.set(channel.id, messages)
      }
    } catch (error) {
      console.log(`Failed to retrieve messages for channel ${channel.id}`, error)
    }
  }

  return (
    <Chat user={user} previousMessages={previousMessages} channels={channels}/>
  )
}
