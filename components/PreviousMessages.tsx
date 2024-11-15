/**
 * Represents the previous messages in a channel
 */
import React from 'react';
import Message from '@/components/Message';
import { MessageProps } from '@/utils/types/types'
import styles from '@/app/ChatPage.module.css';


export default function PreviousMessages({ messages }: { messages: MessageProps[] }) {
    return (
        <div className={styles.chatWindow}>
            {messages.map((message, index) => (
                <Message
                    key={index}
                    user={message.user}
                    channel_id={message.channel_id}
                    timestamp={message.timestamp}
                    body={message.body}
                />
            ))}
        </div>
    )
}
