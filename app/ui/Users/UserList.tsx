import React, {useState, useEffect} from 'react';
import { useAppState } from '@/app/lib/contexts/AppContext';
import { ChannelUser } from '@/app/lib/types/types';
import {Button} from "@/app/ui/Catalyst/button";
import {PlusIcon} from "@heroicons/react/16/solid";
import {Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle} from "@/app/ui/Catalyst/dialog";
import {Field, Label} from "@/app/ui/Catalyst/fieldset";
import {Input} from "@/app/ui/Catalyst/input";
import {addUserToChannel, fetchAllUsers} from "@/app/lib/api/api";

const UserList: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { currentChannel, channelUsers } = state;
    let [isOpen, setIsOpen] = useState(false)
    const [display_name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [userSuggestions, setUserSuggestions] = useState<ChannelUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<ChannelUser | null>(null);

    const users: ChannelUser[] = channelUsers.get(currentChannel) || [];

    // Fetch user suggestions based on the display name
    useEffect(() => {
        const fetchUserSuggestions = async () => {
            if (display_name.trim() === '') {
                setUserSuggestions([]);
                return;
            }

            try {
                const allUsers = await fetchAllUsers();
                const filteredUsers = allUsers.filter((user: { display_name: string }) =>
                    user.display_name.toLowerCase().includes(display_name.toLowerCase())
                );
                setUserSuggestions(filteredUsers);
            } catch (error) {
                console.error('Error fetching user suggestions:', error);
            }
        };

        fetchUserSuggestions();
    }, [display_name]);

    const handleAddUser = async () => {
        if (!selectedUser) {
            alert('Please select a user from the suggestions.');
            return;
        }

        setIsLoading(true);
        try {
            // Add the user to the current channel; ensure currentChannel is a string
            await addUserToChannel(currentChannel.toString(), selectedUser.id.toString());

            // Update the state with the new user in the channel
            dispatch({
                type: 'ADD_USER_TO_CHANNEL',
                payload: {
                    channelId: currentChannel,
                    user: selectedUser,
                },
            });

            alert('User added to the channel successfully');
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
            setIsOpen(false);
            setName('');
            setSelectedUser(null);
        }
    };

    const handleUserSelect = (user: ChannelUser) => {
        setName(user.display_name);
        setSelectedUser(user);
        setUserSuggestions([]);
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-900 text-gray-300 p-3 mt-16 sm:mt-0">
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
            <Button outline onClick={() => setIsOpen(true)}>
                Add User <PlusIcon />
            </Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>
                    Add a user to the channel you are in.
                </DialogDescription>
                <DialogBody>
                    <Field>
                        <Label>DisplayName</Label>
                        <Input name="display_name" placeholder="displayname" value={display_name} onChange={(event) => setName(event.target.value)}/>
                        {userSuggestions.length > 0 && (
                            <ul className="absolute bg-white border mt-1 w-full max-h-32 overflow-y-auto z-10">
                                {userSuggestions.map((user) => (
                                    <li
                                        key={user.id}
                                        className="p-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        {user.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Field>
                </DialogBody>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddUser} disabled={isLoading}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UserList;