"use client";

import Link from 'next/link';
import { Bot, FileText, AlertTriangle, Users } from 'lucide-react';
import styles from './page.module.css';
import ChatWindow from '@/components/chat/ChatWindow';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  // Force scroll to top on mount to override browser scroll restoration
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>

              <h1 className={styles.title}>
                <span className="tricolor-text-dark">{t('heroTitle')}</span><br />
                AI-Powered Civic Companion
              </h1>
              <p className={styles.subtitle}>
                {t('heroSubtitle')}
              </p>
              <div className={styles.heroActions}>
                <Link href="/services" className="btn btn-secondary">
                  {t('exploreServices')}
                </Link>
                <Link href="/complaints" className="btn btn-outline">
                  {t('trackComplaints')}
                </Link>
              </div>
            </div>
            
            <div className={styles.heroChat}>
              <ChatWindow />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIconWrapper} style={{ backgroundColor: '#E3F2FD', color: '#1565C0' }}>
                <Bot size={28} />
              </div>
              <h3>{t('featAiTitle')}</h3>
              <p>{t('featAiDesc')}</p>
            </div>
            
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIconWrapper} style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                <FileText size={28} />
              </div>
              <h3>{t('featServTitle')}</h3>
              <p>{t('featServDesc')}</p>
            </div>
            
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIconWrapper} style={{ backgroundColor: '#FFF3E0', color: '#E65100' }}>
                <AlertTriangle size={28} />
              </div>
              <h3>{t('featCompTitle')}</h3>
              <p>{t('featCompDesc')}</p>
            </div>
            
            <div className={`card ${styles.featureCard}`}>
              <div className={styles.featureIconWrapper} style={{ backgroundColor: '#F3E5F5', color: '#6A1B9A' }}>
                <Users size={28} />
              </div>
              <h3>{t('featSchemeTitle')}</h3>
              <p>{t('featSchemeDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
