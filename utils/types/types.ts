
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
    timestamp: string;
}

/**
 * Interface for communicating with the REST API
 * /users/:userId/channels
 */
export interface Channel {
    name: string;
    description: string;
}