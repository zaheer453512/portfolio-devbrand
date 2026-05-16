'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { authApi } from '@/lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill in all fields');
    setLoading(true);
    try {
      const res = await authApi.login(form.email, form.password);
      Cookies.set('admin_token', res.data.token, { expires: 7 });
      toast.success('Welcome back!');
      router.replace('/admin/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] grid-lines flex items-center justify-center p-6">
      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-primary/20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-primary/20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-primary/10" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-primary/10" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-primary flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z" fill="#000"/>
            </svg>
          </div>
          <h1 className="font-display text-3xl tracking-widest">ADMIN ACCESS</h1>
          <p className="text-gray-600 text-sm font-mono mt-2">Authorized personnel only</p>
        </div>

        <div className="bg-[#0D0D0D] border border-[#1a1a1a] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                className="input"
                placeholder="admin@yoursite.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pr-12"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Authenticating...
                </span>
              ) : 'Access Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-700 font-mono mt-6">
          DevBrand Admin Panel v1.0
        </p>
      </div>
    </div>
  );
}
