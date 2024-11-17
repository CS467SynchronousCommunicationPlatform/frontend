import React from 'react';
import styles from '../app/ChatPage.module.css';
import { ChannelUser } from '@/utils/types/types';

const UserList: React.FC<{ users: ChannelUser[] }> = ({ users }) => {
    const onlineUsers = users.filter(user => user.status === 'online');
    const awayUsers = users.filter(user => user.status === 'away');
    const offlineUsers = users.filter(user => user.status === 'offline');

    return (
        <div className={styles.sidebarRight}>
            <h3>Status: Online</h3>
            <div className={styles.userStatus}>
                <p>Online</p>
                <ul>
                    {onlineUsers.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.userStatus}>
                <p>Away</p>
                <ul>
                    {awayUsers.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.userStatus}>
                <p>Offline</p>
                <ul>
                    {offlineUsers.map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserList;