// components/Message.tsx
import React from 'react';
import styles from '../app/ChatPage.module.css';

interface MessageProps {
  user: string;
  timestamp: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ user, timestamp, content }) => {
  return (
    <div className={styles.message}>
      <span className={styles.user}>{user}</span> <span className={styles.timestamp}>{timestamp}</span>
      <p>{content}</p>
    </div>
  );
};

export default Message;