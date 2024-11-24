"use client"; // Mark this as a client component

import React from 'react';
import { Navbar, NavbarItem, NavbarSection } from '@/app/ui/Catalyst/navbar';
import { MoonIcon, UserIcon, HomeModernIcon, CogIcon } from "@heroicons/react/20/solid";
import { useAppState } from '@/app/lib/contexts/AppContext';

const NavBar = () => {
    const { dispatch } = useAppState();

    const handleToggleChannelBar = () => {
        dispatch({ type: 'TOGGLE_CHANNEL_BAR' });
    };

    const handleToggleUserList = () => {
        dispatch({ type: 'TOGGLE_USER_LIST' });
    };

    return (
        <header className="bg-gray-800 text-white border-b border-gray-700 fixed w-full top-0 z-20">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Mobile view left side Moon Icon */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={handleToggleChannelBar}
                        >
                            <span className="sr-only">Toggle Channel List</span>
                            <MoonIcon className="block h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Mobile view right side User Icon */}
                    <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={handleToggleUserList}
                        >
                            <span className="sr-only">Toggle User List</span>
                            <UserIcon className="block h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Main Navbar Section */}
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        {/* Mobile view Home and Settings Icons */}
                        <div className="flex sm:hidden">
                            <Navbar>
                                <NavbarSection>
                                    <NavbarItem href="/">
                                        <HomeModernIcon className="block h-6 w-6" aria-hidden="true" />
                                        <span className="sr-only">Home</span>
                                    </NavbarItem>
                                    <NavbarItem href="/AdminPanel">
                                        <CogIcon className="block h-6 w-6" aria-hidden="true" />
                                        <span className="sr-only">Settings</span>
                                    </NavbarItem>
                                </NavbarSection>
                            </Navbar>
                        </div>
                        {/* Desktop view */}
                        <div className="hidden sm:block sm:ml-6">
                            <Navbar>
                                <NavbarSection>
                                    <NavbarItem href="/">Home</NavbarItem>
                                    <NavbarItem href="/AdminPanel">Settings</NavbarItem>
                                </NavbarSection>
                            </Navbar>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;