
import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Sparkles, Layout, Download, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Rocket size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter">AI Portfolio</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="font-bold text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
          <Link to="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-8">
            <Sparkles size={16} />
            <span>AI-Powered Portfolio Builder</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
            Your Professional Identity, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Generated in Seconds.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            The ultimate platform for freelancers to build, preview, and download stunning portfolio websites. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
              Build Your Portfolio <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:border-indigo-600 transition-all">
              View Templates
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4">Everything you need to stand out.</h2>
            <p className="text-slate-500 text-lg">Powerful features designed for modern freelancers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Sparkles className="text-indigo-600" />}
              title="AI Bio Generator"
              description="Generate professional, punchy descriptions for your portfolio using advanced AI."
            />
            <FeatureCard 
              icon={<Layout className="text-purple-600" />}
              title="Premium Templates"
              description="Choose from a variety of responsive templates tailored for different professions."
            />
            <FeatureCard 
              icon={<Download className="text-emerald-600" />}
              title="Instant Export"
              description="Download your complete portfolio as a standalone ZIP file ready for hosting."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Rocket size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter">AI Portfolio</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 AI Portfolio Generator. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8">
        {React.cloneElement(icon as React.ReactElement, { size: 32 })}
      </div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
