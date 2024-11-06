// page.tsx
import React from 'react';
import styles from './ChatPage.module.css';
import ChannelBar from "@/components/ChannelBar";
import Chat from "@/components/Chat";
import UserList from "@/components/UserList";
import ChatInput from "@/components/ChatInput";
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
      <div className={styles.container}>
        {/* Left Sidebar */}
        <ChannelBar />

        {/* Main Chat Section */}
        <Chat />
        <ChatInput />

        {/* Right Sidebar */}
        <UserList />
      </div>
  );
};

export default ChatPage;