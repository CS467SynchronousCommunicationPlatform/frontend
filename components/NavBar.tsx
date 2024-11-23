import React from 'react';
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai'; // Icons for home and admin
import styles from '@/app/ChatPage.module.css'
import {NavItem} from "@/components/NavItem";
import { useRouter } from 'next/router';

const NavBar = () => {
    const router = useRouter(); // current route

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navItems}>
                <li className={`${styles.navItem} ${router.pathname === '/' ? styles.active : ''}`}>
                    <NavItem href="/"><AiOutlineHome size={24} /></NavItem>
                </li>
                <li className={`${styles.navItem} ${router.pathname === '/' ? styles.active : ''}`}>
                    <NavItem href="/admin"><AiOutlineSetting size={24} /></NavItem>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
