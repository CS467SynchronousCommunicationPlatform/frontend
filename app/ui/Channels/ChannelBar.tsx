"use client";


import { signout } from '@/app/login/actions';
import { socket } from '@/socket';
import { Button } from "@/app/ui/Catalyst/button";
import { PlusIcon} from "@heroicons/react/16/solid";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/ui/Catalyst/dialog'
import {useState, useEffect} from "react";
import { Field, Label } from '@/app/ui/Catalyst/fieldset'
import { Input } from '@/app/ui/Catalyst/input'
import { Checkbox, CheckboxField } from '@/app/ui/Catalyst/checkbox'
import {
    fetchAllChannelsForCurrentUser,
    fetchAllPreviousMessages,
    fetchChannelUsers,
    createNewChannel,
    resetUnread,
    fetchNotificationCount
} from "@/app/lib/api/api";
import { useAppState } from '@/app/lib/contexts/AppContext';





export default function ChannelBar() {
    const { state, dispatch } = useAppState();
    const { channels, currentChannel, user, unreadMessagesCount } = state;
    const [isConnected, setIsConnected] = useState(socket.connected);

    let [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [isPrivate, setIsPrivate] = useState('True')
    // A new state to trigger effect for fetching data
    const [shouldFetchData, setShouldFetchData] = useState(false);

    let togglePrivate = () => {
        console.log(isPrivate)
        setIsPrivate(isPrivate => isPrivate === 'True' ? 'False' : 'True');

    }

    // Handler for creating a new channel
    const createChannel = async () => {
        if (!/^[a-zA-Z0-9 ]+$/.test(name) || !/^[a-zA-Z0-9 ]+$/.test(description)) {
            alert("Channel name and description can only contain alphanumeric characters and spaces.");
            return;
        }
        console.log(name)
        console.log(description)

        try {
            // @ts-ignore
            const response = await createNewChannel(name.trim(), description, isPrivate, user.id);
            const newChannel = {
                id: response.id,
                name: name.trim(),
                description,
                private: isPrivate === 'True',
            };
            dispatch({ type: 'SET_CHANNELS', payload: [...channels, newChannel] });
            alert("Channel created successfully!");
            // Set shouldFetchData to true to trigger useEffect
            setShouldFetchData(true);
            // Optionally, update UI with new channel details
            setIsOpen(false); // Close the dialog

        } catch (err) {
            console.error("Error creating channel:", err);
            alert("Failed to create channel. Please try again.");
        }
    };

    useEffect(() => {
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('channel', async (msg) => {
            const channels = await fetchAllChannelsForCurrentUser(user!);
            dispatch({ type: 'SET_CHANNELS', payload: channels });
            setShouldFetchData(true);
        })

        setShouldFetchData(true);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    useEffect(() => {
        if (shouldFetchData) {
            const fetchData = async () => {
                try {
                    const [updatedChannels, newMessages, newUserList, newUnreadCounts] = await Promise.all([
                        // @ts-ignore
                        fetchAllChannelsForCurrentUser(user),
                        fetchAllPreviousMessages(channels),
                        fetchChannelUsers(channels),
                        fetchNotificationCount(user!.id, channels)
                    ]);
                    dispatch({ type: 'SET_CHANNELS', payload: updatedChannels });
                    dispatch({ type: 'SET_MESSAGES', payload: newMessages });
                    dispatch({ type: 'SET_CHANNEL_USERS', payload: newUserList });
                    dispatch({ type: 'SET_UNREAD_COUNT', payload: newUnreadCounts });
                } catch (error) {
                    console.error("Failed to fetch updated data:", error);
                }
            };
            fetchData();
            setShouldFetchData(false); // Reset shouldFetchData flag
        }
    }, [shouldFetchData, user, channels, dispatch]);

    const handleChannelSelect = async (channelId: number) => {
        dispatch({ type: 'SET_CURRENT_CHANNEL', payload: channelId });
        dispatch({ type: 'RESET_UNREAD_COUNT', payload: channelId });
        await resetUnread(user!.id, channelId);
    };

    // Group channels by public and private
    const publicChannels = channels.filter((channel) => !channel.private);
    const privateChannels = channels.filter((channel) => channel.private);

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-gray-900 text-gray-300 p-3 mt-16 sm:mt-0">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Public Channels</h3>
            <ul>
                {publicChannels.map(channel => {
                    const unreadCount = unreadMessagesCount.get(channel.id) || 0;
                    return (
                        <li key={channel.id}
                            className={`p-2 text-sm rounded hover:bg-gray-700 hover:text-white transition flex justify-between items-center ${channel.id === currentChannel ? 'bg-gray-700' : ''}`}>
                            <span onClick={() => handleChannelSelect(channel.id)} className="cursor-pointer flex-grow">
                                {channel.name}
                            </span>
                            {unreadCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                    {unreadCount}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4 mt-4">Private Channels</h3>
            <ul>
                {privateChannels.map(channel => {
                    const unreadCount = unreadMessagesCount.get(channel.id) || 0;
                    return (
                        <li key={channel.id}
                            className={`p-2 text-sm rounded hover:bg-gray-700 hover:text-white transition flex justify-between items-center ${channel.id === currentChannel ? 'bg-gray-700' : ''}`}>
                            <span onClick={() => handleChannelSelect(channel.id)} className="cursor-pointer flex-grow">
                                {channel.name}
                            </span>
                            {unreadCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                    {unreadCount}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
            <Button outline onClick={() => setIsOpen(true)}>
                Create Channel <PlusIcon/>
            </Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Create Channel</DialogTitle>
                <DialogDescription>
                    Enter the details for the new channel.
                </DialogDescription>
                <DialogBody>
                    <Field>
                        <Label>Channel Name</Label>
                        <Input name="name" placeholder="Channel Name" value={name}
                               onChange={(event) => setName(event.target.value)}/>
                    </Field>
                    <Field>
                        <Label>Description</Label>
                        <Input name="description" placeholder="Description" value={description}
                               onChange={(event) => setDescription(event.target.value)}/>
                    </Field>
                    <Field>
                        <Label>Private</Label>
                        <CheckboxField>
                            <Checkbox checked={isPrivate === 'True'} onChange={togglePrivate}/>
                            <span>Private Channel</span>
                        </CheckboxField>
                    </Field>
                </DialogBody>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={createChannel}>Create</Button>
                </DialogActions>
            </Dialog>
            <button
                onClick={signout}
                className="mt-auto p-2 text-sm bg-red-600 hover:bg-red-500 rounded text-white"
            >
                Logout
            </button>
        </div>
    );
};
