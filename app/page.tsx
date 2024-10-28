
'use client'
=======
// page.tsx
import React from 'react';
import styles from './ChatPage.module.css';
import { signout } from '@/app/login/actions';

const ChatPage: React.FC = () => {
  return (
      <div className={styles.container}>
        {/* Left Sidebar */}
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
