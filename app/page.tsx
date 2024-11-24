import React from 'react';
import { createClient } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import NavBar  from "@/app/ui/NavBar/NavBar";
import {StackedLayout} from "@/app/ui/Catalyst/stacked-layout";
import { Channel } from '@/app/lib/types/types'
import {Sidebar} from "@/app/ui/Catalyst/sidebar";
import {
    fetchAllChannelsForCurrentUser,
    fetchAllPreviousMessages,
    fetchChannelUsers
} from '@/app/lib/api/api';
import Master from "@/app/ui/Master/Master";
// Ensure AdminPanelComponent is a proper component
import { AppProvider, useAppState } from '@/app/lib/contexts/AppContext';

/**
 * The entry point to our Admin Panel.
 * Handles authentication and data fetching.
 * @returns AdminPanel component
 */
export default async function HomePage() {
    // Initialize Supabase
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // CHANNEL BAR HELP
    // fetch all channels the user is subscribed to
    // fetch all channels the user is subscribed to
    const channels: Channel[] = await fetchAllChannelsForCurrentUser(user)


    // fetch previous messages
    const previousMessages = await fetchAllPreviousMessages(channels)

    // fetch all users for all channels a user is subscribed to
    const channelUsers = await fetchChannelUsers(channels)

    // set initial global state
    const initialState = {
        user,
        channels,
        currentChannel: 4,
        allMessages: new Map(previousMessages),
        channelUsers: new Map(channelUsers),
    }

    return (
        <StackedLayout
            navbar={<NavBar />}
            sidebar={<Sidebar />}
        >
            <Master
                user={user}
                previousMessages={previousMessages}
                channels={channels}
                channelUsers={channelUsers}
            />
        </StackedLayout>
    );
}