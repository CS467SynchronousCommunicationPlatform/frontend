/**
 * Represents the input field where users can type and submit messages
 */

"use client";

import { useState } from 'react'
import { ChatInputProps } from '@/app/lib/types/types'
import EmojiPicker, { Theme } from 'emoji-picker-react'


export default function ChatInput({ handlers }: { handlers: ChatInputProps }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

    const toggleEmojiMenu = () => {
        setShowEmojiPicker((prevState: boolean) => !prevState);
    };

    return (
        <>
            <div className="flex items-center bg-gray-700 p-2 rounded-lg border border-gray-600">
                <form onSubmit={handlers.submitHandler} className="flex flex-1 items-center">
                    <input
                        className="flex-1 bg-gray-800 text-gray-300 p-3 rounded-md outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Message #general"
                        value={handlers.value}
                        onChange={handlers.onChangeHandler}
                    />
                    <button
                        type="button"
                        className="ml-2 p-2 text-sm text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md"
                        onClick={toggleEmojiMenu}
                    >
                        Emojis
                    </button>
                    <button
                        type="submit"
                        className="ml-2 p-2 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-md"
                    >
                        Send
                    </button>
                </form>
            </div>
            {showEmojiPicker && (
                <EmojiPicker theme={Theme.DARK} onEmojiClick={handlers.emojisHandler} />
            )}
        </>
    );
}
