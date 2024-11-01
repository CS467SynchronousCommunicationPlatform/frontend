import React from 'react';
import styles from '../app/ChatPage.module.css'
import { signout } from '@/app/login/actions';

const ChannelBar: React.FC = () => (
    <div className={styles.sidebarLeft}>
        <h3>Channels</h3>
        <ul>
            <li className={styles.activeChannel}>general</li>
            <li>User3</li>
            <li>User4</li>
            <li>User7</li>
        </ul>
        <button onClick={signout} className={styles.logoutButton}>Logout</button>
    </div>
);

export default ChannelBar;