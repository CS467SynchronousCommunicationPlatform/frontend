import React from 'react';
import Chat from "@/components/Chat";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Channel } from '@/utils/types/types'
import { 
  fetchAllChannelsForCurrentUser, 
  fetchAllPreviousMessages,
  fetchChannelUsers 
} from '@/utils/api/api';


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
  const channels: Channel[] = await fetchAllChannelsForCurrentUser(user)

  // fetch previous messages
  const previousMessages = await fetchAllPreviousMessages(channels)

  // fetch all users in a channel
  const channelUsers = await fetchChannelUsers(channels)

  return (
    <Chat 
      user={user}
      previousMessages={previousMessages}
      channels={channels}
      channelUsers={channelUsers}
      />
  )
}
