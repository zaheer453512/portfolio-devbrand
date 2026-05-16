'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { contentApi, authApi } from '@/lib/api';

interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url';
  placeholder: string;
  section: string;
}

const contentFields: ContentField[] = [
  // Hero
  { key: 'hero_name', label: 'Your Name', type: 'text', placeholder: 'John Doe', section: 'Hero' },
  { key: 'hero_title', label: 'Hero Title', type: 'text', placeholder: 'Shopify & Full Stack Developer', section: 'Hero' },
  { key: 'hero_subtitle', label: 'Hero Description', type: 'textarea', placeholder: 'Your main intro paragraph...', section: 'Hero' },
  { key: 'hero_available', label: 'Availability Text', type: 'text', placeholder: 'Available for Projects', section: 'Hero' },
  // About
  { key: 'about_bio', label: 'Bio / About', type: 'textarea', placeholder: 'Your full bio...', section: 'About' },
  { key: 'about_location', label: 'Location', type: 'text', placeholder: 'Lahore, Pakistan', section: 'About' },
  { key: 'about_experience', label: 'Years Experience', type: 'text', placeholder: '3+', section: 'About' },
  // Contact
  { key: 'contact_whatsapp', label: 'WhatsApp Number', type: 'text', placeholder: '923001234567', section: 'Contact' },
  { key: 'contact_email', label: 'Email Address', type: 'text', placeholder: 'dev@yoursite.com', section: 'Contact' },
  { key: 'contact_linkedin', label: 'LinkedIn URL', type: 'url', placeholder: 'https://linkedin.com/in/...', section: 'Contact' },
  { key: 'contact_github', label: 'GitHub URL', type: 'url', placeholder: 'https://github.com/...', section: 'Contact' },
  // Stats
  { key: 'stat_projects', label: 'Projects Count', type: 'text', placeholder: '50+', section: 'Stats' },
  { key: 'stat_clients', label: 'Clients Count', type: 'text', placeholder: '30+', section: 'Stats' },
  { key: 'stat_experience', label: 'Experience', type: 'text', placeholder: '3+ Years', section: 'Stats' },
  { key: 'stat_satisfaction', label: 'Satisfaction Rate', type: 'text', placeholder: '99%', section: 'Stats' },
  // SEO
  { key: 'seo_title', label: 'Page Title', type: 'text', placeholder: 'John Doe — Shopify Developer', section: 'SEO' },
  { key: 'seo_description', label: 'Meta Description', type: 'textarea', placeholder: 'Professional Shopify developer...', section: 'SEO' },
];

export default function AdminContent() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('Hero');

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const sections = [...new Set(contentFields.map(f => f.section))];

  useEffect(() => {
    contentApi.getAll()
      .then(res => setValues(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await contentApi.update(key, values[key] || '', 'text');
      toast.success('Saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    const fields = contentFields.filter(f => f.section === activeSection);
    setSaving('all');
    try {
      await Promise.all(fields.map(f => contentApi.update(f.key, values[f.key] || '', 'text')));
      toast.success('All saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(null);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new !== pwForm.confirm) return toast.error('Passwords do not match');
    if (pwForm.new.length < 8) return toast.error('Password must be at least 8 characters');
    setPwLoading(true);
    try {
      await authApi.changePassword({ currentPassword: pwForm.current, newPassword: pwForm.new });
      toast.success('Password updated!');
      setPwForm({ current: '', new: '', confirm: '' });
    } catch {
      toast.error('Failed to update password');
    } finally {
      setPwLoading(false);
    }
  };

  const activeFields = contentFields.filter(f => f.section === activeSection);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white">CONTENT</h1>
        <p className="text-gray-600 text-sm font-mono mt-1">Manage all website text content</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <div className="bg-[#0D0D0D] border border-[#1a1a1a]">
            {sections.map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-3 font-mono text-sm transition-colors border-b border-[#111] last:border-0 ${
                  activeSection === section
                    ? 'bg-primary/10 text-primary border-l-2 border-l-primary'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {section}
              </button>
            ))}
            <button
              onClick={() => setActiveSection('Security')}
              className={`w-full text-left px-4 py-3 font-mono text-sm transition-colors ${
                activeSection === 'Security' ? 'bg-primary/10 text-primary border-l-2 border-l-primary' : 'text-gray-500 hover:text-white'
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Content fields */}
        <div className="lg:col-span-3">
          {activeSection === 'Security' ? (
            <div className="bg-[#0D0D0D] border border-[#1a1a1a] p-6">
              <h2 className="font-display text-2xl mb-6">CHANGE PASSWORD</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Current Password</label>
                  <input type="password" className="input" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">New Password</label>
                  <input type="password" className="input" value={pwForm.new} onChange={e => setPwForm({ ...pwForm, new: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Confirm New Password</label>
                  <input type="password" className="input" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
                </div>
                <button type="submit" disabled={pwLoading} className="btn btn-primary">
                  {pwLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-[#0D0D0D] border border-[#1a1a1a]">
              <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
                <h2 className="font-display text-2xl">{activeSection.toUpperCase()}</h2>
                <button onClick={handleSaveAll} disabled={saving === 'all'} className="btn btn-primary text-xs">
                  {saving === 'all' ? 'Saving...' : 'Save All'}
                </button>
              </div>
              <div className="p-6 space-y-6">
                {loading ? (
                  [...Array(4)].map((_, i) => <div key={i} className="skeleton h-12" />)
                ) : (
                  activeFields.map(field => (
                    <div key={field.key}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">{field.label}</label>
                        <button
                          onClick={() => handleSave(field.key)}
                          disabled={saving === field.key}
                          className="text-xs font-mono text-primary hover:text-white transition-colors"
                        >
                          {saving === field.key ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                      {field.type === 'textarea' ? (
                        <textarea
                          className="input h-24 resize-none"
                          placeholder={field.placeholder}
                          value={values[field.key] || ''}
                          onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                        />
                      ) : (
                        <input
                          type={field.type}
                          className="input"
                          placeholder={field.placeholder}
                          value={values[field.key] || ''}
                          onChange={e => setValues({ ...values, [field.key]: e.target.value })}
                        />
                      )}
                      <p className="text-xs text-gray-700 font-mono mt-1">key: {field.key}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
