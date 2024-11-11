/**
 * Initializes a socket.io client connection. Auth token is user.id
 * Socket connections must be rendered client-side and Nextjs renders server-side
 * by default, so this file must be marked with the 'use client' directive
 * Source: https://socket.io/how-to/use-with-react 
 * TOOD: Add error handling
 */

"use client";

import { useEffect, useState } from 'react'
import { socket, updateSocketAuth } from '@/socket'
import { type User } from "@supabase/supabase-js"
import { MessageProps, Channel } from '@/utils/types/types'
import ChatInput, { ChatInputProps } from '@/components/ChatInput'
import PreviousMessages from '@/components/PreviousMessages'
import UserList from '@/components/UserList'
import ChannelBar from '@/components/ChannelBar';
import styles from '@/app/ChatPage.module.css'


/**
 * The Chat component is the real-time layer of our application
 * It connects the user to our backend socket server and allows them to send
 * messages to any channels they are currently subscribed to.
 * @TODO: Generalize sendMessage handler to send the message to whatever channel is currently selected
 * @param user: the user authenticated through Supabase - is a Supabase User type
 * @param previousMessages: an array of the previous messages of a channel
 * @param channels: the channels the user is subscribed to
 * @returns 
 */
export default function Chat({ user, previousMessages, channels }: { user: User, previousMessages: MessageProps[], channels: Channel[] }) {
  const [msgBody, setMsgBody] = useState<string>('')
  const [msgHistory, setMsgHistory] = useState<MessageProps[]>(previousMessages)
  const [isConnected, setIsConnected] = useState(socket.connected)


  useEffect(() => {
    updateSocketAuth(user.id)
    socket.connect()
    console.log('Client connected')

    return () => {
      // When the user logs out or closes the page, disconnect the socket
      socket.disconnect()
    }
  }, [user.id])

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true)
    }
    // If there is a connection error, try again with the auth token
    const onError = (err: Error) => {
      setIsConnected(false)
      if (socket.active) {
        // Temporary failure, not denied by the server
        // update auth token and retry
        updateSocketAuth(user.id)
      } else {
        // connection was denied by the server, disconnect the socket
        console.log(err.message)
        socket.disconnect()
      }
    }
  
    const onIncomingMessage = (message: MessageProps) => {
      setMsgHistory([...msgHistory, message])
    }

    socket.on('connect', onConnect)  
    socket.on('general', onIncomingMessage)
    socket.on('connect_error', onError)

    // Cleanup event listeners
    return () => {
      socket.off('connect', onConnect)
      socket.off('connect_error', onError)
      socket.off('general', onIncomingMessage)
    }
  }, [msgHistory, user.id])

  // Send a message to the general channel
  // TODO: Generalize this to send to the specified channel
  const sendGeneralMessage = (event: React.FormEvent) => {
    event.preventDefault()
    if (isConnected) {
      const message: MessageProps = {
        user: user.id,
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
      <ChannelBar channels={channels} />
      <PreviousMessages messages={msgHistory} />
      <ChatInput handlers={inputHandlers} />
      <UserList />
    </div>
  )
}
