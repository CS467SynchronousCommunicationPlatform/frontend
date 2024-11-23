import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { NavBar } from "@/components/NavBar";
import AdminPanelComponent from "@/components/AdminPanel"; // Ensure AdminPanelComponent is a proper component

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
        <div>
            {user && <NavBar />}
            <AdminPanelComponent user={user} />
        </div>
    );
}