/**
 * Represents the previous messages in a channel
 */
import React, { useEffect, useRef } from 'react';
import Message from '@/app/ui/components/Message';
import { MessageProps } from '@/app/lib/types/types';

export default function PreviousMessages({ messages }: { messages: MessageProps[] }) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

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
