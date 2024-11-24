import React from 'react';
import { createClient } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import NavBar  from "@/app/ui/NavBar/NavBar";
import {StackedLayout} from "@/app/ui/Catalyst/stacked-layout";
import AdminPanelComponent from "@/app/AdminPanel/AdminPanel";
import {Sidebar} from "@/app/ui/Catalyst/sidebar"; // Ensure AdminPanelComponent is a proper component

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

    return (
        <StackedLayout
            navbar={<NavBar />}
            sidebar={<Sidebar />}
        >
            <AdminPanelComponent user={user} />
        </StackedLayout>
    );
}