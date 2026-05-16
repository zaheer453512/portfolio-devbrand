'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { reviewsApi } from '@/lib/api';

interface Review {
  _id: string;
  name: string;
  email: string;
  review: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  pinned: boolean;
  video?: { url: string };
  createdAt: string;
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filtered, setFiltered] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ name: '', review: '', rating: 5 });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    reviewsApi.getAllAdmin()
      .then(res => {
        setReviews(res.data);
        applyFilter(res.data, filterStatus);
      })
      .catch(() => toast.error('Failed to load reviews'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const applyFilter = (data: Review[], status: FilterStatus) => {
    setFiltered(status === 'all' ? data : data.filter(r => r.status === status));
  };

  const changeFilter = (status: FilterStatus) => {
    setFilterStatus(status);
    applyFilter(reviews, status);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await reviewsApi.updateStatus(id, status);
      toast.success(`Review ${status}`);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const toggleFeature = async (id: string, field: 'featured' | 'pinned', value: boolean) => {
    try {
      await reviewsApi.feature(id, { [field]: value });
      toast.success(`Review ${field} ${value ? 'enabled' : 'disabled'}`);
      load();
    } catch {
      toast.error('Failed to update');
    }
  };

  const openEdit = (r: Review) => {
    setEditReview(r);
    setEditForm({ name: r.name, review: r.review, rating: r.rating });
  };

  const saveEdit = async () => {
    if (!editReview) return;
    try {
      await reviewsApi.update(editReview._id, editForm);
      toast.success('Review updated');
      setEditReview(null);
      load();
    } catch {
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reviewsApi.delete(id);
      toast.success('Review deleted');
      setDeleteConfirm(null);
      load();
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const counts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
  };

  const filterTabs: { key: FilterStatus; label: string; color: string }[] = [
    { key: 'all', label: `All (${counts.all})`, color: 'text-gray-400' },
    { key: 'pending', label: `Pending (${counts.pending})`, color: 'text-yellow-400' },
    { key: 'approved', label: `Approved (${counts.approved})`, color: 'text-green-400' },
    { key: 'rejected', label: `Rejected (${counts.rejected})`, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-white">REVIEWS</h1>
          <p className="text-gray-600 text-sm font-mono mt-1">{counts.pending} pending approval</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#0D0D0D] border border-[#1a1a1a] p-1 w-fit">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => changeFilter(tab.key)}
            className={`px-4 py-2 font-mono text-xs transition-all ${
              filterStatus === tab.key ? 'bg-[#1a1a1a] text-white' : `text-gray-600 hover:text-white ${tab.color}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-px bg-[#1a1a1a]">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="bg-[#0D0D0D] p-6 skeleton h-28" />)
        ) : filtered.length === 0 ? (
          <div className="bg-[#0D0D0D] p-16 text-center text-gray-600 font-mono text-sm">
            No reviews in this category.
          </div>
        ) : (
          filtered.map((review) => (
            <div key={review._id} className="bg-[#0D0D0D] p-6 hover:bg-[#111] transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Left: Author info */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-xl">
                    {review.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{review.name}</div>
                    <div className="text-xs text-gray-600">{review.email}</div>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < review.rating ? '#FFB800' : 'none'} stroke="#FFB800" strokeWidth="1.5">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Middle: Review content */}
                <div className="flex-1">
                  <p className="text-sm text-gray-300 leading-relaxed mb-2">"{review.review}"</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-mono text-[10px] px-2 py-0.5 ${
                      review.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                      review.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {review.status}
                    </span>
                    {review.pinned && <span className="font-mono text-[10px] px-2 py-0.5 bg-primary/10 text-primary">PINNED</span>}
                    {review.featured && <span className="font-mono text-[10px] px-2 py-0.5 bg-yellow-500/10 text-yellow-400">FEATURED</span>}
                    {review.video?.url && <span className="font-mono text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-400">HAS VIDEO</span>}
                    <span className="text-xs text-gray-700 ml-auto">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Video preview */}
                  {review.video?.url && (
                    <div className="mt-3 max-w-xs">
                      <video src={review.video.url} controls className="w-full h-24 object-cover bg-black" />
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex-shrink-0 flex flex-row lg:flex-col gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(review._id, 'approved')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors text-xs font-mono"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(review._id, 'rejected')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors text-xs font-mono"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Reject
                      </button>
                    </>
                  )}
                  {review.status === 'approved' && (
                    <button
                      onClick={() => toggleFeature(review._id, 'pinned', !review.pinned)}
                      className={`flex items-center gap-1 px-3 py-1.5 border transition-colors text-xs font-mono ${
                        review.pinned ? 'bg-primary/10 text-primary border-primary/20' : 'bg-[#1a1a1a] text-gray-500 border-[#222] hover:text-primary'
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill={review.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {review.pinned ? 'Unpin' : 'Pin'}
                    </button>
                  )}
                  <button onClick={() => openEdit(review)} className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] text-gray-500 border border-[#222] hover:text-primary transition-colors text-xs font-mono">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(review._id)} className="flex items-center gap-1 px-3 py-1.5 bg-[#1a1a1a] text-gray-500 border border-[#222] hover:text-red-400 transition-colors text-xs font-mono">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editReview && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setEditReview(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-[#0D0D0D] border border-[#222] w-full max-w-lg p-8"
            >
              <h2 className="font-display text-2xl mb-6">EDIT REVIEW</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Client Name</label>
                  <input className="input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Rating</label>
                  <select className="input" value={editForm.rating} onChange={e => setEditForm({ ...editForm, rating: Number(e.target.value) })}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-500 mb-2 uppercase">Review Text</label>
                  <textarea className="input h-28 resize-none" value={editForm.review} onChange={e => setEditForm({ ...editForm, review: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <button onClick={saveEdit} className="btn btn-primary">Save Changes</button>
                  <button onClick={() => setEditReview(null)} className="btn btn-ghost">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <div className="bg-[#0D0D0D] border border-red-900/40 p-8 max-w-sm w-full text-center">
              <h3 className="font-display text-xl mb-2">DELETE REVIEW?</h3>
              <p className="text-gray-500 text-sm mb-6">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDelete(deleteConfirm)} className="btn flex-1 justify-center bg-red-600 text-white text-xs">Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="btn btn-ghost flex-1 justify-center">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
