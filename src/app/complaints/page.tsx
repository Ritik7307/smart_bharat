"use client";

import { useState } from 'react';
import { Plus, X, CheckCircle, AlertTriangle, MapPin, Send, MessageSquare } from 'lucide-react';
import styles from '../page.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  location: string;
  category: string;
}

const INITIAL_COMPLAINTS: Complaint[] = [
  { id: '1', title: 'Broken Street Light - Sector 4', description: 'The street light near the main park has been broken for 2 weeks.', status: 'In Progress', date: '12 May 2026', location: 'Sector 4', category: 'Infrastructure' },
  { id: '2', title: 'Pothole Repair - MG Road', description: 'Large pothole causing traffic slowdowns and hazard.', status: 'Resolved', date: '01 May 2026', location: 'MG Road', category: 'Roads' },
];

export default function Complaints() {
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [aiDraftMessage, setAiDraftMessage] = useState('');

  const handleOpenModal = () => setIsModalOpen(true);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setAiDraftMessage('');
  };

  const handleAiDraft = async () => {
    if (!newDescription && !newTitle) return;
    
    setIsAiDrafting(true);
    setAiDraftMessage('');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ 
            role: 'user', 
            content: `I want to report a civic issue. Please rewrite this into a formal, concise, and clear official complaint format. Also suggest a short title. Here is my rough draft: Title: "${newTitle}", Description: "${newDescription}". Return ONLY the rewritten Title on the first line, and the rewritten description on the following lines.` 
          }] 
        }),
      });
      
      const data = await response.json();
      if (response.ok && data.reply) {
        // Simple parsing of AI response
        const lines = data.reply.split('\n');
        const aiTitle = lines[0].replace(/Title:|#|\*/gi, '').trim();
        const aiDesc = lines.slice(1).join('\n').trim();
        
        if (aiTitle) setNewTitle(aiTitle);
        if (aiDesc) setNewDescription(aiDesc);
      } else {
        setAiDraftMessage('Failed to draft. Please try again.');
      }
    } catch (e) {
      setAiDraftMessage('Network error occurred.');
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const newComplaint: Complaint = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      location: newLocation || 'Not specified',
      status: 'Pending',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      category: 'General',
    };

    setComplaints([newComplaint, ...complaints]);
    handleCloseModal();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved': return <span style={{ backgroundColor: '#E6F4EA', color: '#1E8E3E', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12} /> {status}</span>;
      case 'In Progress': return <span style={{ backgroundColor: '#FEF7E0', color: '#B06000', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> {status}</span>;
      default: return <span style={{ backgroundColor: '#F1F3F4', color: '#5F6368', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>{status}</span>;
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', padding: '4rem 0', backgroundColor: 'var(--color-background)', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 className="tricolor-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>{t('complaintsTitle')}</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>{t('complaintsSubtitle')}</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} />
            {t('complaintsReportBtn')}
          </button>
        </div>

        <div className="card" style={{ padding: '0' }}>
          {complaints.length > 0 ? (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {complaints.map((complaint, index) => (
                <li key={complaint.id} style={{ 
                  padding: '1.5rem', 
                  borderBottom: index < complaints.length - 1 ? '1px solid var(--color-border)' : 'none' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 600 }}>{complaint.title}</h3>
                    {getStatusBadge(complaint.status)}
                  </div>
                  <p style={{ color: 'var(--color-text-main)', marginBottom: '1rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {complaint.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14} /> {complaint.location}</span>
                    <span>Reported on {complaint.date}</span>
                    <span>Category: {complaint.category}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <p>{t('complaintsNoIssues')}</p>
            </div>
          )}
        </div>
      </div>

      {/* New Complaint Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card fade-in" style={{ 
            width: '100%', maxWidth: '600px', maxHeight: '90vh', 
            overflowY: 'auto', position: 'relative',
            backgroundColor: 'white' 
          }}>
            <button 
              onClick={handleCloseModal}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
            >
              <X size={24} />
            </button>
            
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>{t('complaintsModalTitle')}</h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>{t('complaintsFormTitle')}</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={t('complaintsFormTitleHolder')}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>{t('complaintsFormLoc')}</label>
                <input 
                  type="text" 
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder={t('complaintsFormLocHolder')}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>
                  {t('complaintsFormDesc')} 
                  <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{t('complaintsFormDescSub')}</span>
                </label>
                <textarea 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder={t('complaintsFormDescHolder')}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                  required
                />
              </div>

              {/* AI Assistant Button */}
              <div style={{ backgroundColor: '#F8F9FA', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {t('complaintsAiDraft')}
                    </p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAiDraft}
                    disabled={isAiDrafting || (!newTitle && !newDescription)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {isAiDrafting ? '...' : t('complaintsAiRewrite')}
                  </button>
                </div>
                {aiDraftMessage && <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', marginTop: '0.5rem' }}>{aiDraftMessage}</p>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={handleCloseModal} className="btn btn-outline" style={{ border: 'none' }}>{t('complaintsCancel')}</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Send size={16} />
                  {t('complaintsSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
