"use client";

import React, { useState } from 'react';
import { updateUserDisplayName } from '@/utils/api/api';
import { User } from '@supabase/supabase-js';

interface AdminPanelProps {
    user: User;
}

const AdminPanelComponent: React.FC<AdminPanelProps> = ({ user }) => {
    const [displayName, setDisplayName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Alphanumeric validation
        const alphanumericRegex = /^[a-zA-Z0-9 ]*$/;
        if (!alphanumericRegex.test(displayName)) {
            setErrorMessage('Display name can only contain letters, numbers, and spaces.');
            return;
        }

        setErrorMessage('');

        try {
            const data = await updateUserDisplayName(user.id, displayName);

            if (data) {
                console.log('Display name updated:', data);
            } else {
                setErrorMessage('Failed to update display name');
            }

        } catch (error) {
            setErrorMessage('An error occurred while updating the display name');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            <p>Welcome to the admin panel, {user.user_metadata.full_name}</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Display Name:
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Submit</button>
                {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default AdminPanelComponent;