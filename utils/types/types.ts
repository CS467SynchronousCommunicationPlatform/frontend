import { EmojiClickData } from "emoji-picker-react";

/**
 * Interface for communicating with the REST API
 * /channels/:channelId/messages
 */
export interface ChannelMessage {
    body: string;
    created_at: string
    users: {
        display_name: string;
    };
}

/**
 * Communication format of socket messages sent between frontend and backend 
 */
export interface MessageProps {
    user: string;
    body: string;
    channel_id: number;
    timestamp: string;
}

/**
 * Interface for communicating with the REST API
 * /users/:userId/channels
 */
export interface Channel {
    name: string;
    description: string;
    id: number;
}

/**
 * Interface for communicating with the REST API
 * /channels/:channelID/users
 */
export interface ChannelUser {
    id: number;
    name: string;
    status: 'online' | 'away' | 'offline';
}

/**
 * Function handlers and values to pass in for the message input form
 */
export interface ChatInputProps {
    submitHandler: (event: React.FormEvent) => void
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
    emojisHandler: (emojiData: EmojiClickData, event: MouseEvent) => void
    value: string
}

/**
 * Channel onClick function handler prop
 */
export interface ChannelHandler {
    onClick: (channel_id: number, event: React.MouseEvent<HTMLLIElement>) => void
}