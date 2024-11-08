/**
 * Represents a list of online, offline, and away Users
 */
import React from 'react';
import styles from '../app/ChatPage.module.css';

const RightSidebar: React.FC = () => {
    return (
        <div className={styles.sidebarRight}>
            <h3>Status: Online</h3>
            <div className={styles.userStatus}>
                <p>Online</p>
                <ul>
                    <li>User1</li>
                    <li>User2</li>
                    <li>User3</li>
                </ul>
            </div>
            <div className={styles.userStatus}>
                <p>Away</p>
                <ul>
                    <li>User4</li>
                </ul>
            </div>
            <div className={styles.userStatus}>
                <p>Offline</p>
                <ul>
                    <li>User5</li>
                    <li>User6</li>
                    <li>User7</li>
                </ul>
            </div>
        </div>
    );
};

export default RightSidebar;