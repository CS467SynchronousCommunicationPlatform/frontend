/**
 * Represents a message sent to a channel
 */
import React from 'react';
import styles from '@/app/ChatPage.module.css';
import { MessageProps } from '@/utils/types/types'

const Message: React.FC<MessageProps> = ({ user, body, timestamp }) => {
  
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleString()
  return (
    <div className={styles.message}>
      <span className={styles.user}>{user}</span> <span className={styles.timestamp}>{formattedDate}</span>
      <p>{body}</p>
    </div>
  );
};

export default Message;