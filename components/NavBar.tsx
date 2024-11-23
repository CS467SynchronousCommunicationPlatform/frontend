import React from 'react';
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai'; // Icons for home and admin
import styles from '@/app/ChatPage.module.css'

const NavBar = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navItems}>
                <li className={`${styles.navItem} ${styles.active}`}>
                    <AiOutlineHome size={24} />
                </li>
                <li className={styles.navItem}>
                    <AiOutlineSetting size={24} />
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
