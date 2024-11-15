/**
 * Represents the input field where users can type and submit messages
 */
import React from 'react'
import { ChatInputProps } from '@/utils/types/types'
import styles from '@/app/ChatPage.module.css'


export default function ChatInput({ handlers }: { handlers: ChatInputProps }) {
    return (
        <div className={styles.chatInputContainer}>
            <form onSubmit={handlers.submitHandler} className={styles.chatForm}>
                <input 
                    className={styles.messageInput}
                    type="text"
                    placeholder="Message general"
                    value={handlers.value}
                    onChange={handlers.onChangeHandler}
                />
                <button type="submit" className="rounded-lg text-sm py-2 mb-2 px-3 me-2">Send message</button>
            </form>
        </div>
    )
}
