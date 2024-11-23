"use client"; // Mark this as a client component

import React from 'react';
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai';
import { usePathname } from 'next/navigation'; // For App Router, use usePathname instead of useRouter
import styles from '@/app/ChatPage.module.css';
import { NavItem } from "@/components/NavItem";

const NavBar = () => {
    const pathname = usePathname(); // Get the current path

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navItems}>
                <li
                    className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}
                >
                    <NavItem href="/"><AiOutlineHome size={24} /></NavItem>
                </li>
                <li
                    className={`${styles.navItem} ${pathname === '/AdminPanel' ? styles.active : ''}`}
                >
                    <NavItem href="/AdminPanel"><AiOutlineSetting size={24} /></NavItem>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;