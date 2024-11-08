/**
 * Represents a message sent to a channel
 */
import React from 'react';
import styles from '@/app/ChatPage.module.css';

// Represents format of messages between frontend and backend
export interface MessageProps {
  user: string | undefined;
  body: string;
  timestamp: string;
}

const Message: React.FC<MessageProps> = ({ user, body, timestamp }) => {
  return (
    <div className={styles.message}>
      <span className={styles.user}>{user}</span> <span className={styles.timestamp}>{timestamp}</span>
      <p>{body}</p>
    </div>
  );
};

export default Message;