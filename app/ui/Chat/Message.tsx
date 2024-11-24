/**
 * Represents a message sent to a channel
 */
import React from 'react';
import { MessageProps } from '@/app/lib/types/types'

const Message: React.FC<MessageProps> = ({ user, body, timestamp }) => {

  const date = new Date(timestamp)
    const formattedDate = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
      <div className="mb-2">
          <span className="text-sm font-bold text-gray-400">{user}</span>{' '}
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <p className="text-sm text-gray-300">{body}</p>
      </div>
  );
};

export default Message;