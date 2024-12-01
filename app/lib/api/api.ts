import { Channel, MessageProps, ChannelMessage, ChannelUser } from '@/app/lib/types/types'
import { type User } from '@supabase/supabase-js'

/**
 *  The URL to the backend REST API
 */
const api: string = process.env.NEXT_PUBLIC_BACKEND_API!
const apiHeaders = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
}
/**
 * Fetch all channels the given user is subscribed to
 * @param user the current user - a Supabase type
 * @returns an array of all channels the user subscribed to, or an empty array
 */
export async function fetchAllChannelsForCurrentUser(user: User) {
    try {
        const response = await fetch(`${api}/users/${user.id}/channels`, apiHeaders)
        if (response.ok) {
            const data: Channel[] = await response.json()
            console.log(data)
            return data
        }
    } catch(error) {
        console.log(`Failed to get channels for user ${user.id}: ${error}`)
    }
    return []
}

  // fetch previous messages
  // k: channel_id v: an array of all messages received

/**
 * Fetch all previous messages for the channels the current user is subscribed to
 * Use this in the root page.tsx after fetchAllChannelsForCurrentUser
 * @param channels the channels the current user is subscribed to
 * @returns a map of all previous messages - k: channel_id, v: an array of all messages received
 */
export async function fetchAllPreviousMessages(channels: Channel[]) {
    const previousMessages = new Map<number, MessageProps[]>
    for (const channel of channels) {
        try {
            const response = await fetch(`${api}/channels/${channel.id}/messages`, apiHeaders)
            if (response.ok) {
                const data = await response.json()
                // Map the differences between api and socket formats
                const messages: MessageProps[] = data.map((message: ChannelMessage) => ({
                    user: message.users.display_name,
                    body: message.body,
                    channel_id: channel.id,
                    timestamp: message.created_at
                }))
                previousMessages.set(channel.id, messages)
            }
        } catch (error) {
            console.log(`Failed to retrieve messages for channel ${channel.id}: ${error}`)
        }
    }
    return previousMessages
}


export async function fetchChannelUsers(channels: Channel[]) {
    const channelsAndUsers = new Map<number, ChannelUser[]>
    for (const channel of channels) {
        try {
            const response = await fetch(`${api}/channels/${channel.id}/users`, apiHeaders);
            if (response.ok) {
              const users = await response.json();
              console.log(users)
              channelsAndUsers.set(channel.id, users)
            }
          } catch (error) {
            console.error('Error with users', error);
          }
    }
    return channelsAndUsers
}


/**
 * Update the display name of a user.
 * @param userId The ID of the user to update.
 * @param displayName The new display name.
 * @returns The updated user data or an error message.
 */
export async function updateUserDisplayName(userId: string, displayName: string) {
    const response = await fetch(`${api}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ displayName }),
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update display name');
    }
}

/**
 * Create a new channel
 * This function hits the /channels endpoint and creates a new channel with the given name, description, and privacy.
 * @param name The name of the channel
 * @param description The description of the channel
 * @param isPrivate Boolean indicating if the channel is private
 * @returns The newly created channel data or an error message
 */
export async function createNewChannel(name: string, description: string, isPrivate: string, userid: string) {
    const requestBody = {
        name,
        description,
        private: isPrivate,
    };

    try {
        const response = await fetch(`${api}/channels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const channel = (await response.json())[0];
            console.log(channel.id)
            await addUserToChannel(channel.id.toString(), userid)
            return channel;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create channel');
        }
    } catch (error) {
        console.error('Error creating channel:', error);
        throw error;
    }
}

/**
 * Add a user to a specified channel
 * This function hits the /channels/:channelId/users endpoint to add a user to a channel.
 * @param channelId The ID of the channel
 * @param userId The ID of the user to be added
 * @returns A success message or an error message
 */
export async function addUserToChannel(channelId: string, userId: string) {
    const requestBody = {
        userId,
    };

    try {
        const response = await fetch(`${api}/channels/${channelId}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            return response;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add user to channel');
        }
    } catch (error) {
        console.error('Error adding user to channel:', error);
        throw error;
    }
}

/**
 * Fetch all users
 * This function hits the /users endpoint and returns all users as a JSON object.
 * @returns an array of users
 */
export async function fetchAllUsers() {
    try {
        const response = await fetch(`${api}/users`, apiHeaders);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch users');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

/**
 * Clear notifications
 * This function hits the /notifications endpoint and clears notifications for a user and channel
 */
export async function resetUnread(userId: string, channelId: number) {
    try {
        const requestBody = {
            function: "clearnotifications",
            userId: userId,
            channelId: channelId
        }
        const response = await fetch(`${api}/notifications`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to reset notifications');
        }
    } catch (error) {
        console.error('Error resetting unread:', error);
        throw error;
    }
}

/**
 * Get notifications
 * This function hits the /notifications endpoint and gets notifications for a user and channel
 */
export async function fetchNotificationCount(userId: string, channels: Channel[]) {
    const channelUnreads = new Map<number, number>
    for (const channel of channels) {
        try {
            const requestBody = {
                userId: userId,
                channelId: channel.id
            }
            const response = await fetch(`${api}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                const notifications = (await response.json())[0];
                console.log(notifications)
                channelUnreads.set(channel.id, notifications.unread)
            }
        } catch (error) {
            console.error('Error with getting notification count', error);
        }
    }
    return channelUnreads
}