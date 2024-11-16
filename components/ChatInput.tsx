/**
 * Represents the input field where users can type and submit messages
 */

"use client";

import { useState } from 'react'
import { ChatInputProps } from '@/utils/types/types'
import styles from '@/app/ChatPage.module.css'
import EmojiPicker, { Theme } from 'emoji-picker-react'


export default function ChatInput({ handlers }: { handlers: ChatInputProps }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)

    const toggleEmojiMenu = () => {
        setShowEmojiPicker((prevState: boolean) => !prevState)
    }
    return (
        <>
            <div className={styles.chatInputContainer}>
                <form onSubmit={handlers.submitHandler} className={styles.chatForm}>
                    <input 
                        className={styles.messageInput}
                        type="text"
                        placeholder="Message general"
                        value={handlers.value}
                        onChange={handlers.onChangeHandler}
                    />
                    <button
                        type="button"
                        className="rounded-lg text-sm py-2 mb-2 px-3 me-2"
                        onClick={toggleEmojiMenu}
                    >Emojis
                    </button>
                    <button type="submit" className="rounded-lg text-sm py-2 mb-2 px-3 me-2">Send message</button>
                </form>
            </div>
            {showEmojiPicker && (
                <EmojiPicker 
                    theme={Theme.AUTO} 
                    className={styles.customEmojiPicker}
                    onEmojiClick={handlers.emojisHandler}
                />
            )}
        </>
    )
}
