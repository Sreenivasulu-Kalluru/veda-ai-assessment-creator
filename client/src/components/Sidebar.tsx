"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'My Groups', path: '/groups', icon: '👥' },
    { label: 'Assignments', path: '/assignments', icon: '📝' },
    { label: 'AI Teacher\'s Toolkit', path: '/toolkit', icon: '🤖' },
    { label: 'My Library', path: '/library', icon: '📚' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoIcon}>V</span> VedaAI
      </Link>
      
      <Link href="/create" className={`btn-primary ${styles.createBtn}`}>
        <span>+</span> Create Assignment
      </Link>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.profile}>
          <div className={styles.avatar}></div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Delhi Public School</span>
            <span className={styles.profileRole}>Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
