"use client";

import React, { useState } from 'react';
import { updateUserDisplayName } from '@/app/lib/api/api';
import { Heading } from "@/app/ui/Catalyst/heading";
import { Divider } from "@/app/ui/Catalyst/divider";
import { Text } from "@/app/ui/Catalyst/text";
import { useAppState } from '@/app/lib/contexts/AppContext';

const AdminPanelComponent: React.FC = () => {
    const { state } = useAppState();
    const [displayName, setDisplayName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const alphanumericRegex = /^[a-zA-Z0-9 ]*$/;
        if (!alphanumericRegex.test(displayName)) {
            setErrorMessage('Display name can only contain letters, numbers, and spaces.');
            return;
        }

        setErrorMessage('');

        try {
            // @ts-ignore
            const data = await updateUserDisplayName(state.user.id, displayName);

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
            <Heading>Admin Panel</Heading>
            <Divider className={'my-6'}></Divider>
            <Text>Welcome to the admin panel, {state.user?.user_metadata.displayName}</Text>
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
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default AdminPanelComponent;