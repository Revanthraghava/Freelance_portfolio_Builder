
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import { supabase } from '../services/supabase';
import { 
  Plus, Layout, Edit3, Trash2, LogOut, Rocket, Clock, Briefcase, Download, AlertCircle, X, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { PortfolioData } from '../types';
import { exportPortfolio } from '../utils/exportUtils';

interface PortfolioRecord {
  id: string;
  user_id: string;
  content: PortfolioData;
  updated_at: string;
}

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setUser(user);
        const data = await portfolioService.getPortfolios();
        setPortfolios(data as PortfolioRecord[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    try {
      await portfolioService.deletePortfolio(id);
      setPortfolios(portfolios.filter(p => p.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete portfolio');
    }
  };

  const handleDownload = async (portfolio: PortfolioRecord) => {
    try {
      await exportPortfolio(portfolio.content);
    } catch (err) {
      console.error(err);
      alert('Failed to export portfolio');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all mr-2">
              <ArrowLeft size={20} />
            </Link>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Rocket size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter">User Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900 leading-none">{user?.user_metadata?.full_name || 'Creator'}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Professional Portal</p>
            </div>
            <button onClick={handleLogout} className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-2 italic">Your Projects</h2>
            <p className="text-slate-500 font-medium">Manage and refine your professional digital presence.</p>
          </div>
          <Link to="/editor" className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3">
            <Plus size={20} /> Build New Project
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={`skeleton-${i}`} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"></div>
            ))}
          </div>
        ) : portfolios.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <Layout size={48} />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">No projects yet.</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">Start your journey by creating your first professional portfolio website.</p>
            <Link to="/editor" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all">
              Build Your First Project <Plus size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((portfolio) => (
              <motion.div 
                key={`portfolio-${portfolio.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden"
              >
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <img src={`https://picsum.photos/seed/${portfolio.id}/600/400`} alt="" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                      {portfolio.content.templateId}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight mb-1">{portfolio.content.name || 'Untitled Project'}</h3>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Briefcase size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">{portfolio.content.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-400 mb-8">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Updated {new Date(portfolio.updated_at).toLocaleDateString()}</span>
                  </div>
 
                  <div className="grid grid-cols-1 gap-4">
                    <Link 
                      to={`/editor/${portfolio.id}`}
                      className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      <Edit3 size={16} /> Build Your Project
                    </Link>
                    <button 
                      onClick={() => handleDownload(portfolio)}
                      className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all"
                    >
                      <Download size={16} /> Download ZIP
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setConfirmDeleteId(portfolio.id);
                      }} 
                      className="flex items-center justify-center gap-2 text-rose-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={16} /> Delete Project
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-2">Delete Project?</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                This action is permanent and cannot be undone. All your project data will be wiped from our servers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="py-4 rounded-xl font-black uppercase tracking-widest text-[10px] bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(confirmDeleteId)}
                  className="py-4 rounded-xl font-black uppercase tracking-widest text-[10px] bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                >
                  Confirm Delete
                </button>
              </div>
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
