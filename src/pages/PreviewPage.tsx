
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import { exportPortfolio } from '../utils/exportUtils';
import TemplateRenderer from '../components/TemplateRenderer';
import { PortfolioData } from '../types';
import { ArrowLeft, Download, Loader2, Share2, Check } from 'lucide-react';

export default function PreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      portfolioService.getPortfolioById(id).then(p => {
        if (p && p.content) {
          setData(p.content);
        } else {
          console.error('Portfolio content not found');
          navigate('/dashboard');
        }
        setLoading(false);
      }).catch((err) => {
        console.error('Failed to fetch portfolio:', err);
        navigate('/dashboard');
      });
    }
  }, [id, navigate]);

  const handleDownload = async () => {
    if (!data) return;
    setExporting(true);
    await exportPortfolio(data);
    setExporting(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  return (
    <div className="relative">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100] h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          <button onClick={() => navigate(`/editor/${id}`)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16}/> Build Your Project
          </button>
          <div className="flex items-center gap-4">
            <button onClick={handleShare} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors">
              {copied ? <Check size={16} className="text-emerald-500"/> : <Share2 size={16}/>} {copied ? 'Copied' : 'Share'}
            </button>
            <button 
              onClick={handleDownload} 
              disabled={exporting}
              className="bg-slate-900 text-white px-6 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {exporting ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>} Download ZIP
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar (Floating) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl text-white px-8 py-4 rounded-full z-[100] flex items-center gap-8 shadow-2xl border border-white/10">
        <button onClick={() => navigate(`/editor/${id}`)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">
          <ArrowLeft size={16}/> Build Your Project
        </button>
        <div className="w-px h-6 bg-white/10"></div>
        <button onClick={handleShare} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">
          {copied ? <Check size={16} className="text-emerald-400"/> : <Share2 size={16}/>} {copied ? 'Copied' : 'Share Link'}
        </button>
        <button 
          onClick={handleDownload} 
          disabled={exporting}
          className="bg-indigo-600 px-6 py-2 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {exporting ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>} Export ZIP
        </button>
      </div>

      {/* Template Rendering */}
      <TemplateRenderer data={data} />
    </div>
  );
}
