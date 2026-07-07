"use client";
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatWindow from './ChatWindow';

export default function GlobalChatWidget() {
  const { isGlobalChatOpen } = useLanguage();
  const pathname = usePathname();

  // Don't render floating widget on home page since it has an embedded one
  if (!isGlobalChatOpen || pathname === '/') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '400px',
      maxWidth: 'calc(100vw - 48px)',
      zIndex: 9999,
      animation: 'slideUp 0.3s ease-out'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <ChatWindow />
    </div>
  );
}
