/**
 * Represents the input field where users can type and submit messages
 */
import React from 'react';
import styles from '@/app/ChatPage.module.css';

// Function handlers to pass in for submit and onchange events, as well as the 
// default value
export interface ChatInputProps {
    submitHandler: (event: React.FormEvent) => void
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
    value: string
}

export default function ChatInput({ handlers }: { handlers: ChatInputProps }) {
    return (
        <div className={styles.chatSection}>
            <form onSubmit={handlers.submitHandler}>
                <input 
                    className={styles.messageInput}
                    type="text"
                    placeholder="Message general"
                    value={handlers.value}
                    onChange={handlers.onChangeHandler}
                />
                <button type="submit" className="bg-blue-700 rounded-lg text-sm py-2 mb-2 px-3 me-2">Send message</button>
            </form>
        </div>
    )
}
