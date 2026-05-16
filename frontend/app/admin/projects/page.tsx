'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { projectsApi } from '@/lib/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail?: { url: string };
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  featured: boolean;
  status: string;
  createdAt: string;
}

const emptyForm = {
  title: '', description: '', shortDescription: '',
  technologies: '', liveUrl: '', githubUrl: '',
  category: 'shopify', featured: false, status: 'published',
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    projectsApi.getAllAdmin()
      .then(res => setProjects(res.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setThumbnail(null);
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description,
      shortDescription: p.shortDescription || '',
      technologies: p.technologies?.join(', ') || '',
      liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '',
      category: p.category, featured: p.featured,
      status: p.status,
    });
    setThumbnail(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return toast.error('Title is required');
    setSubmitting(true);
    try {
      const fd = new FormData();
      const data = {
        ...form,
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      };
      fd.append('data', JSON.stringify(data));
      if (thumbnail) fd.append('thumbnail', thumbnail);

      if (editing) {
        await projectsApi.update(editing._id, fd);
        toast.success('Project updated!');
      } else {
        await projectsApi.create(fd);
        toast.success('Project created!');
      }
      setShowModal(false);
      load();
    } catch {
      toast.error('Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await projectsApi.delete(id);
      toast.success('Project deleted');
      setDeleteConfirm(null);
      load();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const categoryColors: Record<string, string> = {
    shopify: '#95BF47', fullstack: '#61DAFB',
    frontend: '#F7DF1E', backend: '#68A063', other: '#888',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-white">PROJECTS</h1>
          <p className="text-gray-600 text-sm font-mono mt-1">{projects.length} total projects</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-[#1a1a1a]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                {['Project', 'Category', 'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 font-mono text-xs text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-[#111]">
                    <td colSpan={5} className="px-6 py-4"><div className="skeleton h-10" /></td>
                  </tr>
                ))
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-600 font-mono text-sm">
                    No projects yet. Add your first project.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id} className="border-b border-[#111] hover:bg-[#111] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.thumbnail?.url ? (
                          <div className="w-10 h-10 relative flex-shrink-0">
                            <Image src={project.thumbnail.url} alt={project.title} fill className="object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 text-primary font-display">
                            {project.title[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-sm text-white">{project.title}</div>
                          <div className="text-xs text-gray-600 truncate max-w-[200px]">{project.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs px-2 py-1" style={{ color: categoryColors[project.category] || '#888', border: `1px solid ${categoryColors[project.category] || '#888'}20` }}>
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-mono text-xs px-2 py-1 ${project.status === 'published' ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-500/10'}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="text-primary">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </span>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(project)} className="text-gray-600 hover:text-primary transition-colors p-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary transition-colors p-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                              <polyline points="15 3 21 3 21 9"/>
                              <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                          </a>
                        )}
                        <button onClick={() => setDeleteConfirm(project._id)} className="text-gray-600 hover:text-red-400 transition-colors p-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0D0D0D] border border-[#222] w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
                <h2 className="font-display text-2xl">{editing ? 'EDIT PROJECT' : 'ADD PROJECT'}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Title *</label>
                  <input className="input" placeholder="Project title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Short Description</label>
                  <input className="input" placeholder="One-line summary" value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Full Description</label>
                  <textarea className="input h-24 resize-none" placeholder="Detailed description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Category</label>
                    <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      <option value="shopify">Shopify</option>
                      <option value="fullstack">Full Stack</option>
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Status</label>
                    <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Technologies (comma-separated)</label>
                  <input className="input" placeholder="Next.js, Node.js, MongoDB" value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Live URL</label>
                    <input className="input" placeholder="https://example.com" value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">GitHub URL</label>
                    <input className="input" placeholder="https://github.com/..." value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Thumbnail Image</label>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setThumbnail(e.target.files?.[0] || null)} />
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="border border-dashed border-[#333] p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  >
                    {thumbnail ? (
                      <span className="text-sm text-primary">{thumbnail.name}</span>
                    ) : editing?.thumbnail?.url ? (
                      <span className="text-sm text-gray-500">Current image set. Click to replace.</span>
                    ) : (
                      <span className="text-sm text-gray-600">Click to upload thumbnail</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-400">Mark as Featured Project</label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <div className="bg-[#0D0D0D] border border-red-900/40 p-8 max-w-sm w-full text-center">
              <svg className="mx-auto mb-4 text-red-400" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <h3 className="font-display text-xl mb-2">DELETE PROJECT?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone. Media will also be deleted from Cloudinary.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="btn flex-1 justify-center bg-red-600 hover:bg-red-700 text-white text-xs">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost flex-1 justify-center">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
