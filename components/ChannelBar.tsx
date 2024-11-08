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
    const [apiError, setApiError] = useState<boolean>(false);

    // Fetch channels the user belongs to
    const fetchChannels = async () => {
        try {
            const userId = (await createClient().auth.getUser()).data.user!.id;
            const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/users/${userId}/channels`);
            const data = await response.json();
            if (response.ok) {
                setChannels(data);
            } else {
                setApiError(true);
                setChannels(fakeChannels);
                console.error("Failed to fetch channels", data);
            }
        } catch (error) {
            setApiError(true);
            setChannels(fakeChannels);
            console.error("Error fetching channels", error);
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