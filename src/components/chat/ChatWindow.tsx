"use client";

import { useState, useRef, useEffect } from 'react';
import { Minus, Maximize2 } from 'lucide-react';
import styles from './ChatWindow.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
};

export default function ChatWindow() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Initialize greeting based on current language
  useEffect(() => {
    if (messages.length === 0 || messages[0].id === '1') {
      setMessages([
        {
          id: '1',
          role: 'bot',
          content: t('chatGreeting')
        }
      ]);
    }
  }, [language]);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory, language }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'bot', content: 'Failed to connect to the server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    t('sug1'),
    t('sug2'),
    t('sug3')
  ];

  return (
    <div className={styles.chatWindow} style={{ height: isMinimized ? 'auto' : '500px' }}>
      <div className={styles.chatHeader} style={{ justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setIsMinimized(!isMinimized)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="Emblem" className={styles.emblem} />
          <div>
            <h3 style={{ margin: 0 }}>Smart Bharat</h3>
            <p style={{ margin: 0 }}>AI-Powered Civic Companion</p>
          </div>
        </div>
        <button 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}
          onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
        >
          {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
        </button>
      </div>
      
      {!isMinimized && (
        <>
          <div className={styles.chatBody} ref={chatBodyRef}>
        <div className={styles.messagesContainer}>
          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === 'user' ? styles.userMessage : styles.botMessage}>
              {msg.role === 'user' ? (
                <p>{msg.content}</p>
              ) : (
                <div dangerouslySetInnerHTML={{ 
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                    .replace(/\* (.*?)\<br\/\>/g, '• $1<br/>')
                }} style={{ lineHeight: '1.6' }} />
              )}
            </div>
          ))}
          {isLoading && (
            <div className={styles.botMessage}>
              <div className={styles.typingIndicator}>
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>
        
        {messages.length === 1 && (
          <div className={styles.suggestions}>
            <p className={styles.suggestionsTitle}>{t('chatTryAsking')}</p>
            {suggestions.map((s, i) => (
              <button key={i} className={styles.suggestionBtn} onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.chatInputContainer}>
        <input 
          type="text" 
          placeholder={t('chatPlaceholder')} 
          className={styles.chatInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          disabled={isLoading}
        />
        <button className={styles.sendBtn} onClick={() => handleSend(input)} disabled={isLoading || !input.trim()}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
        </>
      )}
    </div>
  );
}
