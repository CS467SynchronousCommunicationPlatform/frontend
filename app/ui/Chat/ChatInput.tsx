/**
 * Represents the input field where users can type and submit messages
 */

"use client";

import { useState, useEffect } from 'react'
import { EmojiClickData } from 'emoji-picker-react';
import { socket } from '@/socket';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useAppState } from '@/app/lib/contexts/AppContext';
import { MessageProps } from '@/app/lib/types/types';


export default function ChatInput() {
    const { state } = useAppState();
    const { user, currentChannel, allMessages } = state;

    const [msgBody, setMsgBody] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState(socket.connected);

    // Update connection status when socket connects or disconnects
    useEffect(() => {
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    const toggleEmojiMenu = () => {
        setShowEmojiPicker((prevState: boolean) => !prevState);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMsgBody(event.target.value);
    };

    const handleEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
        setMsgBody(msgBody + emojiData.emoji);
    };

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        if (isConnected) {
            const message: MessageProps = {
                user: user!.id,
                channel_id: currentChannel,
                body: msgBody,
                timestamp: new Date().toISOString()
            };
            socket.emit('chat', message);
            setMsgBody('');
        }
    };

    return (
        <>
            <div className="flex items-center bg-gray-700 p-2 rounded-lg border border-gray-600">
                <form onSubmit={sendMessage} className="flex flex-1 items-center">
                    <input
                        className="flex-1 bg-gray-800 text-gray-300 p-3 rounded-md outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Message #general"
                        value={msgBody}
                        onChange={handleInputChange}
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
                <EmojiPicker theme={Theme.DARK} onEmojiClick={handleEmojiClick} />
            )}
        </>
    );
}
