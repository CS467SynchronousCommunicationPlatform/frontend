"use client"; // Mark this as a client component

import React from 'react';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/Catalyst/navbar'

const NavBar = () => {


    return (
        <Navbar >
            <NavbarSection>
                <NavbarItem href="/">Home</NavbarItem>
                <NavbarItem href="/AdminPanel">Settings</NavbarItem>
                <NavbarItem href="/NewHome">NewHome</NavbarItem>
            </NavbarSection>
        </Navbar>
    );
};

export default NavBar;