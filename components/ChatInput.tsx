/**
 * Represents the input field where users can type and submit messages
 */

"use client";

import { useState } from 'react'
import { ChatInputProps } from '@/utils/types/types'
import styles from '@/app/ChatPage.module.css'
import EmojiPicker, { Theme } from 'emoji-picker-react'


export default function ChatInput({ handlers }: { handlers: ChatInputProps }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const toggleEmojiMenu = () => {
        setShowEmojiPicker((prevState: boolean) => !prevState);
    };

    return (
        <>
            <div className="flex items-center bg-gray-800 p-2 rounded-md border border-gray-700">
                <form onSubmit={handlers.submitHandler} className="flex flex-1 items-center">
                    <input
                        className="flex-1 bg-gray-700 text-white p-3 rounded-md outline-none placeholder-gray-400"
                        type="text"
                        placeholder="Message #general"
                        value={handlers.value}
                        onChange={handlers.onChangeHandler}
                    />
                    <button
                        type="button"
                        className="ml-2 p-2 text-white bg-gray-700 rounded-md hover:bg-gray-600"
                        onClick={toggleEmojiMenu}
                    >
                        Emojis
                    </button>
                    <button
                        type="submit"
                        className="ml-2 p-2 text-white bg-blue-600 rounded-md hover:bg-blue-500"
                    >
                        Send
                    </button>
                </form>
            </div>
            {showEmojiPicker && (
                <EmojiPicker
                    theme={Theme.DARK}
                    onEmojiClick={handlers.emojisHandler}
                />
            )}
        </>
    );
}
