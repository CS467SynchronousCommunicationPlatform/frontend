import '@/app/ui/globals.css';
import { inter } from '@/app/ui/fonts';
import { AppProvider } from './lib/contexts/AppContext';
import NavBar from "@/app/ui/NavBar/NavBar";
import { createClient } from './lib/supabase/server';
import {
    fetchAllChannelsForCurrentUser,
    fetchAllPreviousMessages,
    fetchChannelUsers,
} from '@/app/lib/api/api';
import { ReactNode } from 'react';
import AuthGuard from './lib/authguard';

export default async function RootLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch data for initial state
    const channels = user ? await fetchAllChannelsForCurrentUser(user) : [];
    const previousMessages = user ? await fetchAllPreviousMessages(channels) : [];
    const channelUsers = user ? await fetchChannelUsers(channels) : [];

    const initialState = {
        user,
        channels,
        currentChannel: 4,
        allMessages: new Map(previousMessages),
        channelUsers: new Map(channelUsers),
        unreadMessagesCount: new Map(),
        isChannelBarVisible: false,
        isUserListVisible: false
    };

    return (
        <html lang="en">
        <body className={inter.className}>
        <AppProvider initialState={initialState}>
            <AuthGuard>
            <NavBar />
                {children}


            </AuthGuard>
        </AppProvider>
        </body>
        </html>
    );
}