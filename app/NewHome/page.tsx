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
} from '@/utils/api/api';// Ensure AdminPanelComponent is a proper component

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
    const channels: Channel[] = await fetchAllChannelsForCurrentUser(user)

    return (
        <StackedLayout
            navbar={<NavBar />}
            sidebar={<Sidebar />}
        >
        </StackedLayout>
    );
}