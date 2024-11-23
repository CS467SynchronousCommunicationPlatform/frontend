import React from 'react';
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai'; // Icons for home and admin
import styles from '@/app/ChatPage.module.css'
import {NavItem} from "@/components/NavItem";

const NavBar = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navItems}>
                <li className={`${styles.navItem} ${styles.active}`}>
                    <NavItem href="/"><AiOutlineHome size={24} /></NavItem>
                </li>
                <li className={styles.navItem}>
                    <NavItem href="/admin"><AiOutlineSetting size={24} /></NavItem>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
