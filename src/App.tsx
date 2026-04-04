
import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';
import { Loader2, Rocket } from 'lucide-react';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const initializationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Safety timeout to prevent getting stuck
    initializationTimeoutRef.current = setTimeout(() => {
      if (isInitializing) {
        console.warn('Initialization safety timeout reached');
        setIsInitializing(false);
      }
    }, 5000);

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setIsInitializing(false);
        if (initializationTimeoutRef.current) {
          clearTimeout(initializationTimeoutRef.current);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current);
      }
    };
  }, [isInitializing]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl animate-bounce mb-8">
          <Rocket size={40} />
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-[0.3em] text-xs">
          <Loader2 className="animate-spin" size={16} />
          Initializing Portal
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={session ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        
        <Route 
          path="/dashboard" 
          element={session ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/editor/:id?" 
          element={session ? <EditorPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/preview/:id" 
          element={session ? <PreviewPage /> : <Navigate to="/login" />} 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
