import React from 'react';
import { useAppState } from '@/app/lib/contexts/AppContext';
import { ChannelUser } from '@/app/lib/types/types';

const UserList: React.FC = () => {
    const { state } = useAppState();
    const { currentChannel, channelUsers } = state;

    // Fetch users for the currently selected channel
    const users: ChannelUser[] = channelUsers.get(currentChannel) || [];

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