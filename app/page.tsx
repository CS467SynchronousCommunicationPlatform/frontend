import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import NavBar  from "@/components/NavBar";
import {StackedLayout} from "@/components/Catalyst/stacked-layout";
import { Channel } from '@/utils/types/types'
import {Sidebar} from "@/components/Catalyst/sidebar";
import {
    fetchAllChannelsForCurrentUser,
    fetchAllPreviousMessages,
    fetchChannelUsers
} from '@/utils/api/api';
import Master from "@/components/Master";
// Ensure AdminPanelComponent is a proper component

/**
 * The entry point to our Admin Panel.
 * Handles authentication and data fetching.
 * @returns AdminPanel component
 */
export default async function AdminPanelPage() {
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