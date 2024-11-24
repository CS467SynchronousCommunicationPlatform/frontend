/**
 * Initializes a socket.io client connection. Auth token is user.id
 * Socket connections must be rendered client-side and Nextjs renders server-side
 * by default, so this file must be marked with the 'use client' directive
 * Source: https://socket.io/how-to/use-with-react
 * TOOD: Add error handling
 */

"use client";

import { useEffect, useState, useRef } from 'react'
import { socket, updateSocketAuth } from '@/socket'
import { MessageProps } from '@/app/lib/types/types'
import ChatInput from '@/app/ui/Chat/ChatInput'
import PreviousMessages from '@/app/ui/Chat/PreviousMessages'
import UserList from '@/app/ui/Users/UserList'
import ChannelBar from '@/app/ui/Channels/ChannelBar';
import { useAppState } from '@/app/lib/contexts/AppContext';



/**
 * The Chat component is the real-time layer of our application
 * It connects the user to our backend socket server and allows them to send
 * messages to any channels they are currently subscribed to.

 * @returns
 */
export default function Master() {
    const {state, dispatch} = useAppState();
    const { user, currentChannel, allMessages, isChannelBarVisible, isUserListVisible } = state;

    const [msgBody, setMsgBody] = useState<string>('')
    const [isConnected, setIsConnected] = useState(socket.connected)

    const channelBarRef = useRef<HTMLDivElement>(null);
    const userListRef = useRef<HTMLDivElement>(null);

    // On page load, connect to the socket


    useEffect(() => {
        // @ts-ignore
        updateSocketAuth(user.id)
        socket.connect()
        console.log('[SOCKET] Client connected')

        return () => {
            // When the user logs out or closes the page, disconnect the socket
            socket.disconnect()
        }// @ts-ignore
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
                // @ts-ignore
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
        }// @ts-ignore
    }, [user.id, dispatch, allMessages])

    const handleClickOutside = (event: MouseEvent) => {
        if (
            channelBarRef.current &&
            !channelBarRef.current.contains(event.target as Node) &&
            userListRef.current &&
            !userListRef.current.contains(event.target as Node)
        ) {
            dispatch({ type: 'HIDE_BARS' });
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="flex h-full">
            {/* ChannelBar */}
            <div
                ref={channelBarRef}
                className={`fixed inset-y-0 left-0 z-10 transform ${
                isChannelBarVisible ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out sm:relative w-64 bg-gray-900 sm:translate-x-0 sm:block`} >
                <ChannelBar />
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 bg-gray-800">
                <div className="flex-1 overflow-y-auto">
                    <PreviousMessages />
                </div>
                <div className="p-4">
                    <ChatInput />
                </div>
            </div>

            {/* UserList */}
            <div
                ref={userListRef}
                className={`fixed inset-y-0 right-0 z-10 transform ${
                isUserListVisible ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out sm:relative w-64 bg-gray-900 sm:translate-x-0 sm:block`}>
                <UserList />
            </div>
        </div>
    );
}
