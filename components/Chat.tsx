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
import { MessageProps, Channel, ChannelHandler, ChatInputProps, ChannelUser } from '@/utils/types/types'
import ChatInput from '@/components/ChatInput'
import PreviousMessages from '@/components/PreviousMessages'
import UserList from '@/components/UserList'
import ChannelBar from '@/components/ChannelBar';
import { EmojiClickData } from 'emoji-picker-react'
import styles from '@/app/ChatPage.module.css'


/**
 * The Chat component is the real-time layer of our application
 * It connects the user to our backend socket server and allows them to send
 * messages to any channels they are currently subscribed to.
 * @param user: the user authenticated through Supabase - is a Supabase User type
 * @param previousMessages: a map of all of the previous messages in channels the user is subscribed to
 * @param channels: the channels the user is subscribed to
 * @returns 
 */
export default function Chat({ user, previousMessages, channels, channelUsers }: { user: User, previousMessages: Map<number, MessageProps[]>, channels: Channel[], channelUsers: Map<number, ChannelUser[]> }) {
  const [msgBody, setMsgBody] = useState<string>('')
  const [currentChannel, setCurrentChannel] = useState<number>(4)
  // define a state variable for all messages, avoid mutating previousMessages since its a prop
  const [allMessages, setAllMessages] = useState<Map<number, MessageProps[]>>(new Map(previousMessages))
  // set the msgHistory to general at first. If undefined set it to an empty array (ts error)
  const [msgHistory, setMsgHistory] = useState<MessageProps[]>(previousMessages.get(4) || [])
  const [isConnected, setIsConnected] = useState(socket.connected)
  // user list logic, set to general at first
  const [userList, setUserList] = useState<ChannelUser[]>(channelUsers.get(4) || [])

  // On page load, connect to the socket
  useEffect(() => {
    updateSocketAuth(user.id)
    socket.connect()
    console.log('[SOCKET] Client connected')

    return () => {
      // When the user logs out or closes the page, disconnect the socket
      socket.disconnect()
    }
  }, [user.id])

  // Update msgHistory and userList when currentChannel or allMessages changes
  useEffect(() => {
    setMsgHistory(allMessages.get(currentChannel) || [])
    setUserList(channelUsers.get(currentChannel) || [])
  }, [currentChannel, allMessages, channelUsers])

  // Socket event handlers
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
    
    // Listens for incoming messages, adds the incoming message to message history
    const onIncomingMessage = (message: MessageProps) => {
      setAllMessages((prevAllMessages) => {
        const newAllMessages = new Map(prevAllMessages)
        const channelMessages = prevAllMessages.get(message.channel_id) || []
        newAllMessages.set(message.channel_id, [...channelMessages, message])
        return newAllMessages
      })
    }

    socket.on('connect', onConnect)  
    socket.on('chat', onIncomingMessage)
    socket.on('connect_error', onError)

    // Cleanup event listeners
    return () => {
      socket.off('connect', onConnect)
      socket.off('connect_error', onError)
      socket.off('chat', onIncomingMessage)
    }
  }, [user.id, currentChannel])

  /**
   * Event handler for when a user sends a message
   * Sends a message to the currently selected channel
   * @param event the event for when a user submits a message
   */
  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault()
    if (isConnected) {
      const message: MessageProps = {
        user: user.id,
        channel_id: currentChannel,
        body: msgBody,
        timestamp: new Date().toISOString()
      }
      socket.emit('chat', message)
      setMsgBody('')
    }
  }
  /**
   * onClick handler for when a user selects a channel
   * Set the current channel and load appropriate messages
   * @param channel_id the channel_id of the selected channel
   * @param event MouseEvent because the ChannelBar consists of li elements
   */
  const selectChannel = (channel_id: number, event: React.MouseEvent<HTMLLIElement>) => {
    // TODO: get rid of console.log
    console.log(event)
    setCurrentChannel(channel_id)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMsgBody(event.target.value)
  }

  const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    console.log(event)
    setMsgBody((prevMsgBody) => prevMsgBody + emojiData.emoji)
  }

  const inputHandlers: ChatInputProps = {
    submitHandler: sendMessage,
    onChangeHandler: handleInputChange,
    emojisHandler: handleEmojiClick,
    value: msgBody,
  }

  const channelHandler: ChannelHandler = {
    onClick: selectChannel
  }

  return (
    <div className={styles.container}>
      <ChannelBar channels={channels} handler={channelHandler} />
      <div className={styles.chatSection}>
        <PreviousMessages messages={msgHistory} />
        <ChatInput handlers={inputHandlers} />
      </div>
      <UserList users={userList}/>
    </div>
  )
}
