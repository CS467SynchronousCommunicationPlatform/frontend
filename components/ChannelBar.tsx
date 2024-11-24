"use client";


import styles from '@/app/ChatPage.module.css';
import { signout } from '@/app/login/actions';
import { Channel, ChannelHandler } from '@/utils/types/types'
import {Heading} from "@/components/Catalyst/heading";
import {Divider} from "@/components/Catalyst/divider";
import { Sidebar, SidebarBody, SidebarItem, SidebarSection} from "@/components/Catalyst/sidebar";


export default function ChannelBar({ channels, handler }: { channels: Channel[], handler: ChannelHandler }) {
    return (
        <div className="flex flex-col h-full overflow-y-auto bg-gray-800 text-white p-2">
            <Heading level={3} className="text-white">Channels</Heading>
            <ul>
                {Array.isArray(channels) &&
                    channels.map((channel, index) => (
                        <li
                            key={index}
                            className="cursor-pointer hover:bg-gray-600 p-1"
                            onClick={(event) => handler.onClick(channel.id, event)}
                        >
                            {channel.name}
                        </li>
                    ))}
            </ul>
            <button
                onClick={signout}
                className="mt-auto p-2 bg-red-500 hover:bg-red-600 text-white"
            >
                Logout
            </button>
        </div>
    );
};
