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
import { MessageProps, Channel, ChannelHandler, ChatInputProps, ChannelUser } from '@/app/lib/types/types'
import ChatInput from '@/app/ui/Chat/ChatInput'
import PreviousMessages from '@/app/ui/Chat/PreviousMessages'
import UserList from '@/app/ui/Users/UserList'
import ChannelBar from '@/app/ui/Channels/ChannelBar';
import { EmojiClickData } from 'emoji-picker-react'
import { useAppState } from '@/app/lib/contexts/AppContext';
import {
    fetchAllChannelsForCurrentUser,
    fetchAllPreviousMessages,
    fetchChannelUsers
} from '@/app/lib/api/api';


/**
 * The Chat component is the real-time layer of our application
 * It connects the user to our backend socket server and allows them to send
 * messages to any channels they are currently subscribed to.

 * @returns
 */
export default function Master() {
    const {state, dispatch} = useAppState();
    const { user, channels, currentChannel, allMessages, channelUsers } = state;

    const [msgBody, setMsgBody] = useState<string>('')
    const [isConnected, setIsConnected] = useState(socket.connected)

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
            dispatch({
                type: 'SET_MESSAGES',
                payload: new Map(allMessages.set(message.channel_id, [
                    ...(allMessages.get(message.channel_id) || []),
                    message
                ]))
            });
        };

        socket.on('connect', onConnect)
        socket.on('chat', onIncomingMessage)
        socket.on('connect_error', onError)

        // Cleanup event listeners
        return () => {
            socket.off('connect', onConnect)
            socket.off('connect_error', onError)
            socket.off('chat', onIncomingMessage)
        }
    }, [user.id, dispatch, allMessages])

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


    return (
        <div className="flex h-full">
            {/* ChannelBar */}
            <div className="w-1/5 bg-gray-900 max-sm:hidden" >
                <ChannelBar />
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 bg-gray-800">
                <div className="flex-1 overflow-y-auto">
                    <PreviousMessages messages={allMessages.get(currentChannel) || []}/>
                </div>
                <div className="p-4">
                    <ChatInput handlers={inputHandlers}/>
                </div>
            </div>

            {/* UserList */}
            <div className="w-1/5 bg-gray-900 max-sm:hidden">
                <UserList />
            </div>
        </div>
    );
}
