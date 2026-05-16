'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectsApi, reviewsApi } from '@/lib/api';
import Link from 'next/link';

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    publishedProjects: 0,
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      projectsApi.getAllAdmin(),
      reviewsApi.getAllAdmin(),
    ]).then(([projRes, revRes]) => {
      const projects = projRes.data;
      const reviews = revRes.data;
      setStats({
        totalProjects: projects.length,
        publishedProjects: projects.filter((p: any) => p.status === 'published').length,
        totalReviews: reviews.length,
        pendingReviews: reviews.filter((r: any) => r.status === 'pending').length,
        approvedReviews: reviews.filter((r: any) => r.status === 'approved').length,
      });
      setRecentReviews(reviews.slice(0, 5));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, sub: `${stats.publishedProjects} Published`, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 7l10 5 10-5"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, color: '#00FF94', href: '/admin/projects' },
    { label: 'Total Reviews', value: stats.totalReviews, sub: `${stats.approvedReviews} Approved`, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, color: '#FFB800', href: '/admin/reviews' },
    { label: 'Pending Reviews', value: stats.pendingReviews, sub: 'Awaiting approval', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, color: '#FF3D00', href: '/admin/reviews' },
    { label: 'Site Status', value: 'Live', sub: 'All systems normal', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, color: '#00FF94', href: '/' },
  ];

  const quickActions = [
    { label: 'Add Project', href: '/admin/projects', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
    { label: 'Manage Reviews', href: '/admin/reviews', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
    { label: 'Upload Media', href: '/admin/media', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg> },
    { label: 'Edit Content', href: '/admin/content', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="font-display text-4xl text-white">DASHBOARD</h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a1a1a]">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={card.href} className="block bg-[#0D0D0D] p-6 hover:bg-[#111] transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div style={{ color: card.color }} className="opacity-60 group-hover:opacity-100 transition-opacity">
                  {card.icon}
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 group-hover:text-primary transition-colors">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
              <div className="font-display text-4xl text-white mb-1">{loading ? '—' : card.value}</div>
              <div className="text-xs text-gray-600 font-mono">{card.label}</div>
              <div className="text-xs mt-1" style={{ color: card.color }}>{card.sub}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-px bg-[#1a1a1a]">
        {/* Recent Reviews */}
        <div className="lg:col-span-2 bg-[#0D0D0D] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl">RECENT REVIEWS</h2>
            <Link href="/admin/reviews" className="text-xs font-mono text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="skeleton h-16" />)
            ) : recentReviews.length === 0 ? (
              <p className="text-gray-600 text-sm font-mono">No reviews yet.</p>
            ) : (
              recentReviews.map((review) => (
                <div key={review._id} className="flex items-center gap-4 p-4 bg-[#111] border border-[#1a1a1a]">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-display text-lg flex-shrink-0">
                    {review.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{review.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 ${
                        review.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                        review.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {review.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{review.review}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < review.rating ? '#FFB800' : 'none'} stroke="#FFB800" strokeWidth="1.5">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-[#0D0D0D] p-6">
          <h2 className="font-display text-xl mb-6">QUICK ACTIONS</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-[#111] border border-[#1a1a1a] hover:border-primary/30 hover:text-primary transition-all group"
              >
                <span className="text-gray-600 group-hover:text-primary transition-colors">{action.icon}</span>
                <span className="text-sm">{action.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto text-gray-700 group-hover:text-primary">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
          </div>

          {/* System info */}
          <div className="mt-6 p-4 border border-[#1a1a1a] space-y-3">
            <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider">System</h3>
            {[
              { label: 'Frontend', value: 'Next.js 14', status: 'ok' },
              { label: 'Backend', value: 'Node.js', status: 'ok' },
              { label: 'Database', value: 'MongoDB', status: 'ok' },
              { label: 'Storage', value: 'Cloudinary', status: 'ok' },
            ].map((sys) => (
              <div key={sys.label} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{sys.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{sys.value}</span>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
