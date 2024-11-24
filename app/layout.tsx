import '@/app/ui/globals.css';
import { inter } from '@/app/ui/fonts';
import { AppProvider } from './lib/contexts/AppContext';
import NavBar from "@/app/ui/NavBar/NavBar";
import { StackedLayout } from "@/app/ui/Catalyst/stacked-layout";
import { Sidebar } from '@/app/ui/Catalyst/sidebar';
import { createClient } from './lib/supabase/server';
import {
    fetchAllChannelsForCurrentUser,
    fetchAllPreviousMessages,
    fetchChannelUsers,
} from '@/app/lib/api/api';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function RootLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Fetch data for initial state
    const channels = await fetchAllChannelsForCurrentUser(user);
    const previousMessages = await fetchAllPreviousMessages(channels);
    const channelUsers = await fetchChannelUsers(channels);

    const initialState = {
        user,
        channels,
        currentChannel: 4,
        allMessages: new Map(previousMessages),
        channelUsers: new Map(channelUsers),
    };

    return (
        <html lang="en">
        <body className={inter.className}>
        <AppProvider initialState={initialState}>
            <StackedLayout
                navbar={<NavBar />}
                sidebar={<Sidebar />}
            >
                {children}
            </StackedLayout>
        </AppProvider>
        </body>
        </html>
    );
}