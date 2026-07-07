"use client";

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { Search, Info, X, FileText, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SERVICES_DATA = [
  { id: 'aadhar', title: 'Aadhar Services', description: 'Update address, check status, or book an appointment for Aadhar.', category: 'Identity', link: 'https://uidai.gov.in/' },
  { id: 'pan', title: 'PAN Card', description: 'Apply for a new PAN card or update existing details for tax purposes.', category: 'Identity', link: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html' },
  { id: 'passport', title: 'Passport Seva', description: 'Apply for a new passport, renew your old one, or check application status.', category: 'Travel', link: 'https://www.passportindia.gov.in/' },
  { id: 'vehicle', title: 'Vehicle Registration', description: 'Vahan and Sarathi services for RC, Driving License, and vehicle transfer.', category: 'Transport', link: 'https://parivahan.gov.in/parivahan/' },
  { id: 'voter', title: 'Voter ID', description: 'Register to vote, update address, or download digital voter ID.', category: 'Identity', link: 'https://voters.eci.gov.in/' },
  { id: 'ration', title: 'Ration Card', description: 'Apply for a new ration card or modify family member details.', category: 'Food & Supply', link: 'https://nfsa.gov.in/' },
  { id: 'income', title: 'Income Certificate', description: 'Apply for an income certificate required for scholarships and subsidies.', category: 'Certificates', link: 'https://www.india.gov.in/' },
  { id: 'birth', title: 'Birth Certificate', description: 'Register a new birth or download an existing birth certificate.', category: 'Certificates', link: 'https://crsorgi.gov.in/' },
];

export default function Services() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [selectedService, setSelectedService] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle global search passed via URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setSearchTerm(q);
    }
  }, []);

  const categories = ['All', ...Array.from(new Set(SERVICES_DATA.map(s => s.category)))];

  const filteredServices = SERVICES_DATA.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAccessService = async (service: any) => {
    setSelectedService(service);
    setAiAnalysis('');
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ 
            role: 'user', 
            content: `I want to access the "${service.title}" government service. Please provide a simplified, easy-to-understand breakdown of: 1. What it is, 2. The exact documents required, 3. The general steps to apply. Keep it structured with bullet points and bold text.` 
          }] 
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setAiAnalysis(data.reply);
      } else {
        setAiAnalysis('Sorry, I encountered an error while trying to fetch the simplified steps.');
      }
    } catch (e) {
      setAiAnalysis('Network error occurred. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeAnalysis = () => {
    setSelectedService(null);
    setAiAnalysis('');
  };

  return (
    <div className={styles.home} style={{ padding: '4rem 0', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="tricolor-text" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>{t('servicesTitle')}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('servicesSubtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={20} />
            <input 
              type="text" 
              placeholder={t('servicesSearchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-full)', 
                border: '1px solid var(--color-border)', fontSize: '1rem', outline: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                style={{ 
                  padding: '0.5rem 1.25rem', 
                  borderRadius: 'var(--radius-full)', 
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: activeCategory === cat ? 'var(--color-primary-content)' : 'var(--color-text-main)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className={styles.featuresGrid}>
          {filteredServices.length > 0 ? filteredServices.map((service) => (
            <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'var(--color-background)', padding: '4px 10px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1rem', alignSelf: 'flex-start' }}>
                {service.category}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{service.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', flexGrow: 1, marginBottom: '1.5rem', lineHeight: 1.6 }}>{service.description}</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem' }}
                  onClick={() => handleAccessService(service)}
                >
                  <Info size={16} />
                  {t('servicesAiDetailsBtn')}
                </button>
                <a 
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0.5rem', fontSize: '0.9rem' }}
                >
                  {t('servicesPortalBtn')}
                </a>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              <p>{t('servicesNoResults')}</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      {selectedService && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card fade-in" style={{ 
            width: '100%', maxWidth: '800px', maxHeight: '90vh', 
            overflowY: 'auto', position: 'relative',
            backgroundColor: 'white' 
          }}>
            <button 
              onClick={closeAnalysis}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={24} />
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ backgroundColor: 'rgba(255, 153, 51, 0.1)', color: 'var(--color-secondary)', padding: '1rem', borderRadius: '50%' }}>
                <FileText size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>{selectedService.title}</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>AI-Simplified Guide</p>
              </div>
            </div>

            <div style={{ minHeight: '200px' }}>
              {isAnalyzing ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '1rem', color: 'var(--color-text-muted)' }}>
                  <div className="spinner" style={{ 
                    width: '40px', height: '40px', border: '4px solid var(--color-border)', 
                    borderTopColor: 'var(--color-secondary)', borderRadius: '50%', animation: 'spin 1s linear infinite' 
                  }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  <p>Smart Bharat AI is analyzing the requirements...</p>
                </div>
              ) : (
                <div style={{ lineHeight: 1.8, color: 'var(--color-text-main)' }}>
                  <div dangerouslySetInnerHTML={{ 
                    __html: aiAnalysis
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                      .replace(/\*(.*?)\<br\/\>/g, '• $1<br/>')
                  }} />
                  
                  <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#F8F9FA', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <CheckCircle color="var(--color-success)" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-success)' }}>Ready to Apply?</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Ensure you have scanned copies of all required documents before proceeding to the official portal.</p>
                      <a href={selectedService.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-block' }}>Proceed to Official Portal</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
