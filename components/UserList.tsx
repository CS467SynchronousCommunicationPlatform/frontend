import React from 'react';
import styles from '../app/ChatPage.module.css';
import { ChannelUser } from '@/utils/types/types';

const UserList: React.FC<{ users: ChannelUser[] }> = ({ users }) => {
    return (
        <div className={styles.sidebarRight}>
            <h3>User List</h3>
            <ul className={styles.userList}>
                {users.map(user => (
                    <li key={user.id}>{user.display_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;