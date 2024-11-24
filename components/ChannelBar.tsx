"use client";


import { signout } from '@/app/login/actions';
import { Channel, ChannelHandler } from '@/utils/types/types'
import {Heading} from "@/components/Catalyst/heading";
import {Divider} from "@/components/Catalyst/divider";
import { Sidebar, SidebarBody, SidebarItem, SidebarSection} from "@/components/Catalyst/sidebar";


export default function ChannelBar({ channels, handler }: { channels: Channel[], handler: ChannelHandler }) {
    return (
        <div className="flex flex-col h-full overflow-y-auto bg-gray-900 text-gray-300 p-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Channels</h3>
            <ul>
                {channels.map((channel, index) => (
                    <li
                        key={index}
                        className="cursor-pointer p-2 rounded hover:bg-gray-700 hover:text-white transition"
                        onClick={(event) => handler.onClick(channel.id, event)}
                    >
                        # {channel.name}
                    </li>
                ))}
            </ul>
            <button
                onClick={signout}
                className="mt-auto p-2 text-sm bg-red-600 hover:bg-red-500 rounded text-white"
            >
                Logout
            </button>
        </div>
    );
};
