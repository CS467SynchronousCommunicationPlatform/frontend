"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppState } from './contexts/AppContext';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state } = useAppState();
    const { user } = state;
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, pathname, router]);

    if (!user && pathname !== '/login') {
        return null; // Or a loading spinner
    }

    return <>{children}</>;
}

export default AuthGuard;