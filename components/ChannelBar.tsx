"use client";

import React, { useEffect, useState } from 'react';
import styles from '../app/ChatPage.module.css';
import { signout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/client'

// channel interface can add more metadata when needed
interface Channel {
    name: string;
}

// fake channels for showing data when API is not up
const fakeChannels: Channel[] = [
    { name: 'general'},
    { name: 'User2893',},
    { name: 'User38475, User23'},
];


const ChannelBar: React.FC = () => {
    // State to store channel data and error status
    const [channels, setChannels] = useState<Channel[]>([]);
    const [apiError, setApiError] = useState<string | null>(null);

    // Fetch channels the user belongs to
    const fetchChannels = async () => {
        try {
            const userId = (await createClient().auth.getUser()).data.user!.id;
            console.log(`${process.env.BACKEND_API}/users/${userId}/channels`)
            const response = await fetch(`${process.env.BACKEND_API}/users/${userId}/channels`);

            // Check response type
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (response.ok) {
                    setChannels(data);
                } else {
                    setApiError(`Failed to fetch channels: ${data.error}`);
                    setChannels(fakeChannels);
                }
            } else {
                const text = await response.text();
                // Log the HTML response to the console
                console.log(`Received unexpected response format: ${text}`);
                setApiError(`Unexpected response format: ${text.substring(0, 100)}`);
                setChannels(fakeChannels);
            }
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                setApiError(`Error fetching channels: ${error.message}`);
            } else {
                setApiError(`Error fetching channels: ${String(error)}`);
            }
            setChannels(fakeChannels);
        }
    };


    useEffect(() => {
        // Fetch channels for the logged-in user
        fetchChannels();
    }, []);

    return (
        <div className={styles.sidebarLeft}>
            <h3>Channels</h3>
            {apiError && (
                <div className={styles.apiError}>
                    !!API NOT UP DUMMY DATA!!
                </div>
            )}
            <ul>
                {channels.map((channel, index) => (
                    <li key={index} className={styles.channel}>
                        {channel.name}
                    </li>
                ))}
            </ul>
            <button onClick={signout} className={styles.logoutButton}>
                Logout
            </button>
        </div>
    );
};

export default ChannelBar;