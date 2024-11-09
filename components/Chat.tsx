/**
 * Initializes a socket.io client connection. Auth token is user.id
 * Socket connections must be rendered client-side and Nextjs renders server-side
 * by default, so this file must be marked with the 'use client' directive
 * Source: https://socket.io/how-to/use-with-nextjs#client 
 * TOOD: Add error handling
 */

"use client";

import { useEffect, useState } from 'react'
import { socket, updateSocketAuth } from '@/socket'
//import { Socket } from 'socket.io-client'
import { type User } from "@supabase/supabase-js"
import {  MessageProps } from '@/components/Message'
import ChatInput, { ChatInputProps } from '@/components/ChatInput'
import PreviousMessages from '@/components/PreviousMessages'
import ChannelBar from '@/components/ChannelBar'
import UserList from '@/components/UserList'
import styles from '@/app/ChatPage.module.css'


export default function Chat({ user }: { user: User | null }) {
  const [msgBody, setMsgBody] = useState<string>('')
  const [msgHistory, setMsgHistory] = useState<MessageProps[]>([])
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    if (user?.id) {
      updateSocketAuth(user.id)
    }
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [user?.id])

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true)
    }

    const onDisconnect = () => {
      setIsConnected(false)
    }

    const onError = () => {
      if (user?.id) {
        updateSocketAuth(user.id)
      }
    }
  
    const onIncomingMessage = (message: MessageProps) => {
      setMsgHistory([...msgHistory, message])
    }

    socket.on('connect', onConnect)  
    // TODO: load previous channel messages from Supabase and display
    socket.on('general', onIncomingMessage)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onError)

    // Cleanup event listeners
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onError)
      socket.off('general', onIncomingMessage)
    }
  }, [msgHistory, user?.id])

  // Send a message to the general channel
  // TODO: Generalize this to send to the specified channel
  const sendGeneralMessage = (event: React.FormEvent) => {
    event.preventDefault()
    if (isConnected) {
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
