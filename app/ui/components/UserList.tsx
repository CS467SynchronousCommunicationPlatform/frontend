import React from 'react';
import { ChannelUser } from '@/app/lib/types/types';

const UserList: React.FC<{ users: ChannelUser[] }> = ({ users }) => {
    return (
        <div className="h-full overflow-y-auto bg-gray-900 text-gray-300 p-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">User List</h3>
            <ul>
                {users.map((user) => (
                    <li
                        key={user.id}
                        className="p-2 text-sm rounded hover:bg-gray-700 hover:text-white transition"
                    >
                        {user.display_name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;