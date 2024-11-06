// components/MessageList.tsx
import React from 'react';
import Message from './Message';
import styles from '../app/ChatPage.module.css';

const messages = [
    { user: 'User1', timestamp: '10/17/2024 11:15 PM', content: "What's up guys" },
    { user: 'User2', timestamp: '10/17/2024 11:20 PM', content: "Getting ready to go party 😊" },
    { user: 'User3', timestamp: '10/17/2024 11:21 PM', content: 'Nice, will Bill be there??' },
    { user: 'User3', timestamp: '10/17/2024 11:30 PM', content: '👍👍👍👍👍' },
    { user: 'User2', timestamp: '10/17/2024 11:32 PM', content: 'His thumbs up seem to say yes!' },
];

const Chat: React.FC = () => {
    return (
        <div className={styles.chatWindow}>
            {messages.map((message, index) => (
                <Message
                    key={index}
                    user={message.user}
                    timestamp={message.timestamp}
                    content={message.content}
                />
            ))}
        </div>
    );
};

export default Chat;