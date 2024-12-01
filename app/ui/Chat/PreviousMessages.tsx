/**
 * Represents the previous messages in a channel
 */
import React, { useEffect, useRef, useState } from 'react';
import { socket } from '@/socket';
import Message from '@/app/ui/Chat/Message';
import { MessageProps } from '@/app/lib/types/types';
import { useAppState } from '@/app/lib/contexts/AppContext';

export default function PreviousMessages() {
    const { state, dispatch } = useAppState();
    const { currentChannel, allMessages } = state;

    const messages = allMessages.get(currentChannel) || [];

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        socket.on('displayname', async (socketMessage) => {
            // create updated message listing and set it
            const newMessages = new Map<number, MessageProps[]>;
            for (const [channelId, messages] of allMessages.entries()) {
                let messageCopy = [...messages]
                for (let message of messageCopy) {
                    if (message.user == socketMessage.previous) {
                        message.user = socketMessage.new;
                    }
                }
                newMessages.set(channelId, messageCopy);
            }
            dispatch({ type: 'SET_MESSAGES', payload: newMessages });
        })

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-800 text-gray-300">
            {messages.map((message, index) => (
                <Message
                    key={index}
                    user={message.user}
                    channel_id={message.channel_id}
                    timestamp={message.timestamp}
                    body={message.body}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
