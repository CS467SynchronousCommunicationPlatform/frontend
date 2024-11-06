// components/MainChatSection.tsx
import React from 'react';
import styles from '../app/ChatPage.module.css';

const ChatInput: React.FC = () => {
    return (
        <div className={styles.chatSection}>
            <input className={styles.messageInput} type="text" placeholder="Message general" />
        </div>
    );
};

export default ChatInput;