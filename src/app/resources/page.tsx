"use client";

import { useState } from 'react';
import { Search, Info, X, FileText, CheckCircle, ExternalLink } from 'lucide-react';
import styles from '../page.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

const RESOURCES_DATA = [
  { id: 'rti', title: 'RTI Act Guide', description: 'Learn how to file a Right to Information request to promote transparency.', category: 'Guides', link: 'https://rtionline.gov.in/' },
  { id: 'emergency', title: 'Emergency Contacts', description: 'List of national and state emergency numbers including Police, Ambulance, and Fire.', category: 'Contacts', link: 'https://indianhelpline.com/' },
  { id: 'voter-guide', title: 'Voter Registration', description: 'Step-by-step process on how to register to vote or update your voter ID card details.', category: 'Guides', link: 'https://voters.eci.gov.in/' },
  { id: 'yojanas', title: 'Government Schemes (Yojanas)', description: 'Browse a comprehensive list of welfare schemes available for citizens.', category: 'Schemes', link: 'https://www.myscheme.gov.in/' },
  { id: 'consumer', title: 'Consumer Protection', description: 'Guide on how to file consumer complaints for defective goods or poor services.', category: 'Legal', link: 'https://consumerhelpline.gov.in/' },
  { id: 'tax', title: 'Income Tax Guide', description: 'Learn the basics of filing Income Tax Returns and understanding tax slabs.', category: 'Finance', link: 'https://incometaxindia.gov.in/' },
];

export default function Resources() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categories = ['All', ...Array.from(new Set(RESOURCES_DATA.map(r => r.category)))];

  const filteredResources = RESOURCES_DATA.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAccessResource = async (resource: any) => {
    setSelectedResource(resource);
    setAiAnalysis('');
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ 
            role: 'user', 
            content: `I want to understand the "${resource.title}" civic resource. Please provide a simplified, easy-to-understand breakdown of: 1. A brief summary of what this is, 2. Who is eligible or who needs this, 3. The key steps or tips to get started. Keep it structured with bullet points and bold text.` 
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
    setSelectedResource(null);
    setAiAnalysis('');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', padding: '4rem 0', backgroundColor: 'var(--color-background)', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="tricolor-text" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>{t('resourcesTitle')}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            {t('resourcesSubtitle')}
          </p>
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={20} />
            <input 
              type="text" 
              placeholder="Search resources (e.g., RTI, Schemes)..." 
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

        {/* Resources Grid */}
        <div className={styles.featuresGrid}>
          {filteredResources.length > 0 ? filteredResources.map((resource) => (
            <div key={resource.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'var(--color-background)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '1rem', alignSelf: 'flex-start' }}>
                {resource.category}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{resource.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', flexGrow: 1, marginBottom: '1.5rem', lineHeight: 1.6 }}>{resource.description}</p>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button 
                  className="btn btn-outline" 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem' }}
                  onClick={() => handleAccessResource(resource)}
                >
                  <Info size={16} />
                  {t('servicesAiDetailsBtn')}
                </button>
                <a 
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0.5rem', fontSize: '0.9rem' }}
                >
                  <ExternalLink size={16} />
                  {t('resourcesExploreBtn')}
                </a>
              </div>
            </div>
          )) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              <p>No resources found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      {selectedResource && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card fade-in" style={{ 
            width: '100%', maxWidth: '800px', maxHeight: '90vh', 
            overflowY: 'auto', position: 'relative',
            backgroundColor: 'var(--color-surface)' 
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
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>{selectedResource.title}</h2>
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
                  <p>Smart Bharat AI is summarizing this resource...</p>
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
                      <h4 style={{ marginBottom: '0.5rem', color: 'var(--color-success)' }}>Got it?</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>You can now visit the official website to read the full guide or take action.</p>
                      <a href={selectedResource.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ExternalLink size={18} />
                        Visit Official Resource
                      </a>
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
