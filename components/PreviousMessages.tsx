/**
 * Represents the previous messages in a channel
 */
import React from 'react';
import Message, { MessageProps } from '@/components/Message';
import styles from '@/app/ChatPage.module.css';

export default function PreviousMessages({ messages }: { messages: MessageProps[] }) {
    return (
        <div className={styles.chatWindow}>
            {messages.map((message, index) => (
                <Message
                    key={index}
                    user={message.user}
                    timestamp={message.timestamp}
                    body={message.body}
                />
            ))}
        </div>
    )
}
