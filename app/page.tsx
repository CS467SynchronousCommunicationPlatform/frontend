// page.tsx
import React from 'react';
import Chat from "@/components/Chat";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { MessageProps, ChannelMessage } from '@/utils/types/types'

/**
 *  The URL to the backend REST API
 */
const api: string = process.env.BACKEND_API!

const ChatPage: React.FC = async () => {
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
    const response = await fetch(api + '/channels/4/messages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })

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
    redirect('/error')
  }
  
  return (
    <Chat user={user} previousMessages={previous} />
  );
};

export default ChatPage;
