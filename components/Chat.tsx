/**
 * Initializes a socket.io client connection. Auth token is user.id
 * Socket connections must be rendered client-side and Nextjs renders server-side
 * by default, so this file must be marked with the 'use client' directive
 * Source: https://socket.io/how-to/use-with-nextjs#client 
 * TOOD: Add error handling
 */

"use client";

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { type User } from "@supabase/supabase-js"
import {  MessageProps } from '@/components/Message'
import ChatInput, { ChatInputProps } from '@/components/ChatInput'
import PreviousMessages from '@/components/PreviousMessages'
import ChannelBar from '@/components/ChannelBar'
import UserList from '@/components/UserList'
import styles from '@/app/ChatPage.module.css'

// The URL to the Socket.IO server
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL

export default function Chat({ user }: { user: User | null }) {
  const [msgBody, setMsgBody] = useState<string>('')
  const [msgHistory, setMsgHistory] = useState<MessageProps[]>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  // Establish the socket connection with user id as auth token
  // Wrap it in a useEffect to prevent reconnections on every render
  useEffect(() => {
    const client = io(socketUrl, {
      auth: {
        token: user?.id
      },
      transports: ["websocket"]
    })
  
    client.on('connect', () => {
      console.log("Connected to SocketIO")
    })
  
    // Listener for incoming general chat messages
    // These will be the messages that are received real-time
    // TODO: load previous channel messages from Supabase and display
    client.on('general', (message: MessageProps) => {
      setMsgHistory([...msgHistory, message])
    })

    setSocket(client)

    // Cleanup event listeners
    // Disconnect socket connection on unmount
    return () => {
      client.off()
      client.disconnect()
    }
  }, [user?.id, msgHistory])

  // Send a message to the general channel
  // TODO: Generalize this to send to the specified channel
  const sendGeneralMessage = (event: React.FormEvent) => {
    event.preventDefault()
    if (socket) {
      const message: MessageProps = {
        user: user?.id,
        body: msgBody,
        timestamp: new Date().toISOString()
      }
      socket.emit('general', message)
      setMsgBody('')
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMsgBody(event.target.value)
  }

  const inputHandlers: ChatInputProps = {
    submitHandler: sendGeneralMessage,
    onChangeHandler: handleInputChange,
    value: msgBody,
  }

  return (
    <div className={styles.container}>
      <ChannelBar />
      <PreviousMessages messages={msgHistory} />
      <ChatInput handlers={inputHandlers} />
      <UserList />
    </div>
  )
}
