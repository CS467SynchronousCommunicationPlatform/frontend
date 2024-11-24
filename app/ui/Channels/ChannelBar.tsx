"use client";


import { signout } from '@/app/login/actions';
import { Button } from "@/app/ui/Catalyst/button";
import { PlusIcon} from "@heroicons/react/16/solid";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/app/ui/Catalyst/dialog'
import {useState, useEffect} from "react";
import { Field, Label } from '@/app/ui/Catalyst/fieldset'
import { Input } from '@/app/ui/Catalyst/input'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/app/ui/Catalyst/checkbox'
import {
    fetchAllChannelsForCurrentUser,
    fetchAllPreviousMessages,
    fetchChannelUsers,
    createNewChannel
} from "@/app/lib/api/api";
import { useAppState } from '@/app/lib/contexts/AppContext';





export default function ChannelBar() {
    const { state, dispatch } = useAppState();
    const { channels, currentChannel, user } = state;

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
        if (shouldFetchData) {
            const fetchData = async () => {
                try {
                    const [updatedChannels, newMessages, newUserList] = await Promise.all([
                        // @ts-ignore
                        fetchAllChannelsForCurrentUser(user),
                        fetchAllPreviousMessages(channels),
                        fetchChannelUsers(channels),
                    ]);
                    dispatch({ type: 'SET_CHANNELS', payload: updatedChannels });
                    dispatch({ type: 'SET_MESSAGES', payload: newMessages });
                    dispatch({ type: 'SET_CHANNEL_USERS', payload: newUserList });
                } catch (error) {
                    console.error("Failed to fetch updated data:", error);
                }
            };
            fetchData();
            setShouldFetchData(false); // Reset shouldFetchData flag
        }
    }, [shouldFetchData, user, channels, dispatch]);

    const handleChannelSelect = (channelId: number) => {
        dispatch({ type: 'SET_CURRENT_CHANNEL', payload: channelId });
    };

    // Group channels by public and private
    const publicChannels = channels.filter((channel) => !channel.private);
    const privateChannels = channels.filter((channel) => channel.private);

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-gray-900 text-gray-300 p-3  mt-16 sm:mt-0">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Channels</h3>

            {/* Public Channels Section */}
            <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Public Channels</h4>
                <ul>
                    {publicChannels.map((channel) => (
                        <li
                            key={channel.id}
                            className={`cursor-pointer p-2 rounded transition ${currentChannel === channel.id ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                            onClick={() => handleChannelSelect(channel.id)}
                        >
                            # {channel.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Private Channels Section */}
            <div className="mt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Private Channels</h4>
                <ul>
                    {privateChannels.map((channel, index) => (
                        <li
                            key={channel.id}
                            className={`cursor-pointer p-2 rounded transition ${currentChannel === channel.id ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 hover:text-white'}`}
                            onClick={() => handleChannelSelect(channel.id)}
                        >
                            # {channel.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Create Channel Button and Dialog */}
            <Button outline onClick={() => setIsOpen(true)}>
                Create Channel <PlusIcon />
            </Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Create Channel</DialogTitle>
                <DialogDescription>
                    Channel names can only contain alphanumeric characters a-z 0-9 and spaces.
                </DialogDescription>
                <DialogBody>
                    <Field>
                        <Label>Channel Name</Label>
                        <Input name="name" placeholder="channel name" value={name} onChange={(event) => setName(event.target.value)}/>
                        <Label>Channel Description</Label>
                        <Input name="description" placeholder="channel description" value={description} onChange={(event) => setDescription(event.target.value)}/>
                        <CheckboxGroup>
                            <CheckboxField>
                                <Checkbox name="privacy" value={isPrivate} defaultChecked onChange={togglePrivate} />
                                <Label>Private Channel?</Label>
                            </CheckboxField>
                        </CheckboxGroup>
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
