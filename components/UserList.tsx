import React from 'react';
import styles from '../app/ChatPage.module.css';
import { ChannelUser } from '@/utils/types/types';

const UserList: React.FC<{ users: ChannelUser[] }> = ({ users }) => {
    return (
        <div className="h-full overflow-y-auto bg-gray-800 text-white p-2">
            <h3 className="text-lg font-bold">User List</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="p-1">
                        {user.display_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;