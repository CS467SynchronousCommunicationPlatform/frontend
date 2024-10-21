// page.tsx
import React from 'react';
import styles from './ChatPage.module.css';

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
          <button className={styles.logoutButton}>Logout</button>
        </div>

        {/* Main Chat Section */}
        <div className={styles.chatSection}>
          <div className={styles.chatHeader}>
            <h3>general</h3>
          </div>
          <div className={styles.chatWindow}>
            <div className={styles.message}>
              <span className={styles.user}>User1</span> <span className={styles.timestamp}>10/17/2024 11:15 PM</span>
              <p>What&apos;s up guys</p>
            </div>
            <div className={styles.message}>
              <span className={styles.user}>User2</span> <span className={styles.timestamp}>10/17/2024 11:20 PM</span>
              <p>Getting ready to go party 😊</p>
            </div>
            <div className={styles.message}>
              <span className={styles.user}>User3</span> <span className={styles.timestamp}>10/17/2024 11:21 PM</span>
              <p>Nice, will Bill be there??</p>
            </div>
            <div className={styles.message}>
              <span className={styles.user}>User3</span> <span className={styles.timestamp}>10/17/2024 11:30 PM</span>
              <p>👍👍👍👍👍</p>
            </div>
            <div className={styles.message}>
              <span className={styles.user}>User2</span> <span className={styles.timestamp}>10/17/2024 11:32 PM</span>
              <p>His thumbs up seem to say yes!</p>
            </div>
          </div>
          <input className={styles.messageInput} type="text" placeholder="Message general" />
        </div>

        {/* Right Sidebar */}
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
      </div>
  );
};

export default ChatPage;