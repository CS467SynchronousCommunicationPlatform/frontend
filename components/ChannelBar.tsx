"use client";

import styles from '@/app/ChatPage.module.css';
import { signout } from '@/app/login/actions';
import { Channel, ChannelHandler } from '@/utils/types/types'

export default function ChannelBar({ channels, handler }: { channels: Channel[], handler: ChannelHandler }) {
    return (
        <div className={styles.sidebarLeft}>
            <h3>Channels</h3>
            <ul>
                {Array.isArray(channels) &&
                channels.map((channel, index) => (
                    <li 
                        key={index} 
                        className={styles.channel}
                        onClick={(event) => handler.onClick(channel.id, event)}
                    >
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
