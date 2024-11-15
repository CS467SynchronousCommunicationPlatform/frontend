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
 * Function handlers to pass in for submit and onchange events, including the
 * default value
 */
export interface ChatInputProps {
    submitHandler: (event: React.FormEvent) => void
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void
    value: string
}

/**
 * Channel onClick function handler prop
 */
export interface ChannelHandler {
    onClick: (channel_id: number, event: React.MouseEvent<HTMLLIElement>) => void
}