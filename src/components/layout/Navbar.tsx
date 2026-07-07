"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { User, Globe, Search, X, BotMessageSquare } from 'lucide-react';
import styles from './Navbar.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t, isGlobalChatOpen, setIsGlobalChatOpen } = useLanguage();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? styles.active : '';
  };

  const languages = ['English', 'हिंदी', 'বাংলা', 'తెలుగు', 'मराठी', 'தமிழ்'] as const;

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleFontSize = (size: 'small' | 'normal' | 'large') => {
    const html = document.documentElement;
    if (size === 'small') html.style.fontSize = '14px';
    else if (size === 'normal') html.style.fontSize = '16px';
    else if (size === 'large') html.style.fontSize = '18px';
  };

  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast');
  };

  return (
    <header className={styles.header}>
      {/* Tricolor Strip */}
      <div className={styles.tricolorStrip}></div>

      {/* Top Bar for Accessibility & Language */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarContent}`}>
          <div className={styles.topLinks}>
            <a href="#main-content" className={styles.skipLink}>{t('skipToMain')}</a>
            <span className={styles.divider}>|</span>
            <div className={styles.accessibility}>
              <button onClick={() => handleFontSize('small')} title="Decrease Text Size">A-</button>
              <button onClick={() => handleFontSize('normal')} title="Normal Text Size">A</button>
              <button onClick={() => handleFontSize('large')} title="Increase Text Size">A+</button>
            </div>
            <span className={styles.divider}>|</span>
            <button className={styles.themeToggle} onClick={toggleHighContrast}>
              {t('highContrast')}
            </button>
          </div>
          
          <div className={styles.topRight}>
            <div className={styles.dropdownContainer}>
              <div 
                className={styles.languageSelectorTop} 
                onClick={() => { setIsLangOpen(!isLangOpen); setIsProfileOpen(false); }}
              >
                <span>{language}</span>
                <span style={{fontSize: '0.7rem', marginLeft: '4px'}}>▼</span>
              </div>
              
              {isLangOpen && (
                <div className={styles.dropdownMenuTop}>
                  {languages.map(lang => (
                    <button 
                      key={lang} 
                      className={styles.dropdownItem}
                      onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={styles.navbar}>
      <div className={`container ${styles.navbarContent}`}>
        <div className={styles.logo}>
          <Link href="/">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Emblem of India" 
              width={40}
              height={40}
              className={styles.logoIcon} 
              priority
            />
            <span className={styles.logoText}>Smart Bharat</span>
          </Link>
        </div>
        
        <div className={styles.navLinks}>
          <Link href="/" className={`${styles.navLink} ${isActive('/')}`}>{t('home')}</Link>
          <Link href="/services" className={`${styles.navLink} ${isActive('/services')}`}>{t('services')}</Link>
          <Link href="/complaints" className={`${styles.navLink} ${isActive('/complaints')}`}>{t('complaints')}</Link>
          <Link href="/resources" className={`${styles.navLink} ${isActive('/resources')}`}>{t('resources')}</Link>
        </div>
        
        <div className={styles.actions}>
          {/* AI Assistant Toggle */}
          <button 
            className={styles.actionBtn} 
            onClick={() => setIsGlobalChatOpen(!isGlobalChatOpen)}
            title="AI Assistant"
            style={{ color: isGlobalChatOpen ? 'var(--color-primary)' : 'inherit' }}
          >
            <BotMessageSquare size={20} />
          </button>

          {/* Search Toggle */}
          <div className={styles.searchContainer}>
            {isSearchOpen && (
              <input 
                type="text" 
                placeholder={t('search')}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                autoFocus
              />
            )}
            <button className={styles.actionBtn} onClick={() => setIsSearchOpen(!isSearchOpen)}>
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          </div>

          {/* Profile Dropdown */}
          <div className={styles.dropdownContainer}>
            <button 
              className={styles.profileBtn}
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsLangOpen(false); }}
            >
              <User size={20} />
            </button>
            
            {isProfileOpen && (
              <div className={styles.dropdownMenu} style={{ right: 0 }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Ritik Prajapati</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{t('citizen')}</p>
                </div>
                <button className={styles.dropdownItem}>{t('profile')}</button>
                <button className={styles.dropdownItem}>{t('settings')}</button>
                <button className={styles.dropdownItem} style={{ color: '#D32F2F' }}>{t('logout')}</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
