// page.tsx
import React from 'react';
import Chat from "@/components/Chat";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const ChatPage: React.FC = async () => {
  // Check if user is authenticated
  const supabase = await createClient()
  const {
      data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
      return redirect('/login')
  }
  return (
    <Chat user={user} />
  );
};

export default ChatPage;
