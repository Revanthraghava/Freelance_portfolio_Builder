
import React, { useState, useEffect, useRef } from 'react';
import { AppState, Theme, PortfolioData } from './types';
import { CATEGORIES, INITIAL_DATA, SOCIAL_ICONS } from './constants';
import CategoryCard from './components/CategoryCard';
import EditorForm from './components/EditorForm';
import PortfolioPreview from './components/PortfolioPreview';
import { supabase, isSupabaseConfigured } from './services/supabase';
import { 
  ArrowLeft, 
  Sparkles, 
  Rocket, 
  Monitor, 
  Eye, 
  EyeOff,
  Share2,
  Check,
  Zap,
  Loader2,
  Palette,
  ShieldCheck,
  ChevronRight,
  Download,
  Lock,
  LogOut,
  User,
  Activity,
  LayoutDashboard,
  Edit3,
  X,
  AlertTriangle,
  UserCheck,
  Globe,
  Mail,
  MapPin,
  CloudOff
} from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>({
    view: 'login',
    data: INITIAL_DATA,
    theme: 'minimal',
  });
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasPublished, setHasPublished] = useState(false);
  const [copied, setCopied] = useState(false);

  const isInitialLoad = useRef(true);

  const fetchUserPortfolio = async (uid: string) => {
    if (!isSupabaseConfigured) return;
    setSyncStatus('syncing');
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('content, theme')
        .eq('user_id', uid)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data && data.content) {
        const mergedData: PortfolioData = {
          ...INITIAL_DATA,
          ...data.content,
        };

        setState(prev => ({
          ...prev,
          data: mergedData,
          theme: (data.theme as Theme) || 'minimal'
        }));
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 2000);
      }
    } catch (err: any) {
      console.warn("Fetch failed, possibly due to network/config:", err.message);
      setSyncStatus('error');
    } finally {
      isInitialLoad.current = false;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const shared = params.get('p');
        
        if (shared) {
          try {
            const decoded = JSON.parse(decodeURIComponent(escape(atob(shared))));
            if (decoded.data) {
              setState(prev => ({
                ...prev,
                data: decoded.data,
                theme: decoded.theme || 'minimal',
                view: 'preview'
              }));
              setIsInitializing(false);
              return;
            }
          } catch (e) {
            console.error("Link decode error", e);
          }
        }

        // Only attempt session check if Supabase is properly configured
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setUserId(session.user.id);
            setUserEmail(session.user.email ?? null);
            await fetchUserPortfolio(session.user.id);
            setState(prev => ({ ...prev, view: 'landing' }));
          }
        } else {
          // Fallback: If not configured, immediately go to landing as guest
          setState(prev => ({ ...prev, view: 'landing' }));
        }
      } catch (err) {
        console.warn("Supabase initialization skipped or failed:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? null);
        if (event === 'SIGNED_IN') {
          await fetchUserPortfolio(session.user.id);
          setState(prev => ({ ...prev, view: 'landing' }));
        }
      } else {
        setUserId(null);
        setUserEmail(null);
        isInitialLoad.current = true;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isInitialLoad.current || !userId || !isSupabaseConfigured || state.view === 'preview' || state.view === 'login') return;

    const timer = setTimeout(() => {
      performSync();
    }, 2500);

    return () => clearTimeout(timer);
  }, [state.data, state.theme, userId, state.view]);

  const performSync = async () => {
    if (!userId || !isSupabaseConfigured) return;
    setSyncStatus('syncing');
    try {
      const { error } = await supabase.from('portfolios').upsert({
        user_id: userId,
        content: state.data,
        theme: state.theme,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (error) throw error;
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
      return true;
    } catch (err: any) {
      console.warn("Sync failed:", err.message);
      setSyncStatus('error');
      return false;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setErrorMessage("Cloud service is not configured. Please use Guest Access.");
      return;
    }
    setIsAuthLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: loginEmail,
          password: loginPass,
          options: { data: { full_name: loginName } }
        });
        if (error) throw error;
        setSuccessMessage("Account created! Check email to verify.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPass,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Auth failed.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setState(prev => ({ ...prev, view: 'login', data: INITIAL_DATA }));
  };

  const updateData = (data: PortfolioData) => setState(prev => ({ ...prev, data }));
  const setTheme = (theme: Theme) => setState(prev => ({ ...prev, theme }));
  
  const handleShare = () => {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ data: state.data, theme: state.theme }))));
    const url = `${window.location.origin}${window.location.pathname}?p=${payload}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const { data, theme } = state;
    const themeConfigs: Record<Theme, any> = {
      minimal: {
        body: 'bg-white text-gray-800',
        card: 'bg-gray-50 border border-gray-100 p-8 rounded-2xl',
        title: 'text-5xl md:text-6xl font-black mb-4 tracking-tight',
        accent: 'text-indigo-600',
        font: "'Plus Jakarta Sans', sans-serif",
        skill: 'bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold',
        sectionHeader: 'text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-10'
      },
      modern: {
        body: 'bg-slate-950 text-slate-100',
        card: 'bg-slate-900 border border-slate-800 p-8 rounded-3xl',
        title: 'text-6xl md:text-7xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400',
        accent: 'text-indigo-400',
        font: "'Plus Jakarta Sans', sans-serif",
        skill: 'bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold',
        sectionHeader: 'text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-10'
      },
      glass: {
        body: 'bg-indigo-600 text-white',
        card: 'bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem]',
        title: 'text-6xl md:text-7xl font-bold mb-4 drop-shadow-xl',
        accent: 'text-white',
        font: "'Plus Jakarta Sans', sans-serif",
        skill: 'bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold',
        sectionHeader: 'text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-10'
      },
      bold: {
        body: 'bg-yellow-400 text-black',
        card: 'bg-white border-4 border-black p-8 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        title: 'text-7xl md:text-8xl font-black uppercase tracking-tighter mb-4',
        accent: 'text-black font-bold border-b-4 border-black',
        font: "'Plus Jakarta Sans', sans-serif",
        skill: 'bg-black text-white px-4 py-2 font-bold uppercase tracking-widest text-xs',
        sectionHeader: 'text-xl font-black uppercase tracking-tighter mb-10 bg-black text-yellow-400 inline-block px-4 py-1'
      },
      classic: {
        body: 'bg-stone-50 text-stone-900',
        card: 'border-b border-stone-200 py-12',
        title: 'text-6xl md:text-7xl font-serif italic mb-6',
        accent: 'text-stone-900 italic border-b border-stone-900',
        font: "'Playfair Display', serif",
        skill: 'border-stone-300 border-b italic px-4 py-1 text-sm font-medium',
        sectionHeader: 'text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-10 border-b border-stone-200 pb-2'
      },
      vibrant: {
        body: 'bg-rose-50 text-rose-950',
        card: 'bg-white rounded-[3rem] p-10 border-4 border-rose-100 shadow-xl',
        title: 'text-6xl md:text-7xl font-black italic tracking-tighter text-rose-600 mb-4',
        accent: 'text-rose-600 font-bold',
        font: "'Plus Jakarta Sans', sans-serif",
        skill: 'bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-xs font-bold',
        sectionHeader: 'text-xs font-black uppercase tracking-[0.4em] text-rose-800/40 mb-10'
      }
    };

    const config = themeConfigs[theme];
    const socialsHtml = Object.entries(data.socials)
      .filter(([_, val]) => val)
      .map(([key, val]) => `<a href="${val}" target="_blank" class="social-link" style="text-decoration: underline; opacity: 0.6; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; font-size: 10px; margin-right: 1.5rem;">${key}</a>`)
      .join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName || 'Professional Portfolio'}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
    <style>
        body { font-family: ${config.font}; scroll-behavior: smooth; }
        .social-link:hover { opacity: 1 !important; color: ${config.accent.split('-')[1] === 'indigo' ? '#4f46e5' : 'inherit'}; }
    </style>
</head>
<body class="${config.body} min-h-screen">
    <div class="max-w-5xl mx-auto px-6 py-20 md:py-32">
        <header class="mb-24 text-center">
            <h1 class="${config.title}">${data.fullName || 'Creative Talent'}</h1>
            <p class="text-xl md:text-2xl opacity-60 font-medium max-w-2xl mx-auto leading-relaxed mb-10">${data.tagline || 'Innovation through excellence.'}</p>
            <div class="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-semibold opacity-80 mb-8">
                ${data.email ? `<a href="mailto:${data.email}" class="underline">${data.email}</a>` : ''}
                ${data.location ? `<span>${data.location}</span>` : ''}
            </div>
            <div class="flex justify-center flex-wrap">${socialsHtml}</div>
        </header>
        <section class="mb-32">
            <h2 class="${config.sectionHeader}">Narrative</h2>
            <div class="text-2xl md:text-3xl font-medium leading-relaxed opacity-90 whitespace-pre-wrap">${data.about || ''}</div>
        </section>
        ${data.skills.length > 0 ? `<section class="mb-32">
            <h2 class="${config.sectionHeader}">Mastery</h2>
            <div class="flex flex-wrap gap-3">${data.skills.map(s => `<span class="${config.skill}">${s.name}</span>`).join('')}</div>
        </section>` : ''}
        <section class="mb-32">
            <h2 class="${config.sectionHeader}">Featured Works</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                ${data.projects.map(p => `<div class="${config.card}">
                    <h3 class="text-2xl font-black mb-3">${p.title}</h3>
                    <p class="opacity-60 mb-8 text-sm md:text-base">${p.description}</p>
                    ${p.link ? `<a href="${p.link}" target="_blank" class="${config.accent} uppercase text-[10px] tracking-widest font-black underline underline-offset-4">View Project →</a>` : ''}
                </div>`).join('')}
            </div>
        </section>
        <footer class="pt-20 border-t border-current opacity-10 text-center">
            <div class="text-[10px] font-black uppercase tracking-[0.5em]">© ${new Date().getFullYear()} ${data.fullName}</div>
        </footer>
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.fullName.replace(/\s+/g, '_')}_Portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    if (userId && isSupabaseConfigured) {
      await performSync();
    }
    setTimeout(() => {
      setHasPublished(true);
      setIsPublishing(false);
    }, 1500);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-600 text-white rounded-3xl flex items-center justify-center animate-bounce shadow-2xl">
          <Rocket size={40} />
        </div>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-indigo-600 animate-pulse">Initializing Portal</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-rose-100 selection:text-rose-900">
      {state.view === 'login' ? (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
          <div className="max-w-xl w-full z-10 flex flex-col items-center">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-tr from-indigo-600 to-rose-600 text-white rounded-[2rem] shadow-2xl mb-8">
                <Rocket size={48} className="animate-float" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">
                FreelancePortfolio
              </h1>
              <p className="text-xl text-slate-500 font-medium">Visual Identity for Elite Creators.</p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white w-full">
              {!isSupabaseConfigured && (
                 <div className="mb-8 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                    <CloudOff className="text-amber-500 shrink-0" size={24}/>
                    <div className="space-y-1">
                       <p className="text-xs font-black uppercase tracking-widest text-amber-700">Cloud Sync Unavailable</p>
                       <p className="text-xs text-amber-600/70 leading-relaxed font-medium">No API keys detected. You can still build and export your portfolio locally using Guest Access.</p>
                    </div>
                 </div>
              )}

              <div className="flex gap-4 mb-8 p-2 bg-slate-100 rounded-[2rem]">
                <button 
                  disabled={!isSupabaseConfigured}
                  onClick={() => setIsSignUp(false)} 
                  className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${!isSignUp && isSupabaseConfigured ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 opacity-50'}`}
                >
                  Sign In
                </button>
                <button 
                  disabled={!isSupabaseConfigured}
                  onClick={() => setIsSignUp(true)} 
                  className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isSignUp && isSupabaseConfigured ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 opacity-50'}`}
                >
                  Join
                </button>
              </div>

              {errorMessage && <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-3"><AlertTriangle size={16}/>{errorMessage}</div>}
              {successMessage && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-3"><UserCheck size={16}/>{successMessage}</div>}

              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <input type="text" required disabled={!isSupabaseConfigured} value={loginName} onChange={(e) => setLoginName(e.target.value)} className="w-full px-8 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold disabled:cursor-not-allowed" placeholder="Legal Name"/>
                )}
                <input type="email" required disabled={!isSupabaseConfigured} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-8 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold disabled:cursor-not-allowed" placeholder="Email Address"/>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required disabled={!isSupabaseConfigured} value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-8 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold disabled:cursor-not-allowed" placeholder="Password"/>
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-6 text-slate-300 hover:text-indigo-600">{showPass ? <EyeOff size={20}/> : <Eye size={20}/>}</button>
                </div>
                <button 
                  type="submit" 
                  disabled={isAuthLoading || !isSupabaseConfigured} 
                  className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl hover:shadow-indigo-500/40 transition-all disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {isAuthLoading ? <Loader2 size={24} className="animate-spin mx-auto"/> : (isSignUp ? "INITIALIZE" : "AUTHENTICATE")}
                </button>
                <button type="button" onClick={() => setState(prev => ({ ...prev, view: 'landing' }))} className="w-full py-5 rounded-[1.5rem] border-2 border-indigo-50 text-indigo-600 font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all flex items-center justify-center gap-3">
                  GUEST ACCESS <ChevronRight size={18}/>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <>
          {state.view !== 'preview' && (
            <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-[60]">
              <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setState(prev => ({...prev, view: 'landing'}))}>
                  <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                    <Rocket size={20} />
                  </div>
                  <h1 className="text-lg md:text-2xl font-black tracking-tighter text-slate-900 leading-none truncate">FreelancePortfolio</h1>
                </div>
                <div className="flex items-center gap-4">
                  {userId && syncStatus !== 'idle' && (
                    <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${syncStatus === 'syncing' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {syncStatus === 'syncing' ? <Loader2 className="animate-spin" size={14}/> : <Check size={14}/>} {syncStatus}
                    </div>
                  )}
                  {userId ? (
                    <div className="flex items-center gap-3">
                      <button onClick={() => setState(prev => ({...prev, view: 'profile'}))} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${state.view === 'profile' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}><User size={20}/></button>
                      <button onClick={handleLogout} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-rose-500 rounded-full transition-all"><LogOut size={20}/></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                       {!isSupabaseConfigured && <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-full"><CloudOff size={14}/> Offline Mode</div>}
                       <button onClick={() => setState(prev => ({ ...prev, view: 'login' }))} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Login</button>
                    </div>
                  )}
                </div>
              </div>
            </header>
          )}

          <main className={state.view === 'preview' ? '' : 'max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20'}>
            {state.view === 'landing' && (
              <div className="space-y-12">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 border border-rose-100"><Sparkles size={14}/> Design Your Legacy</div>
                  <h2 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-tight italic">Choose your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500">creative domain.</span></h2>
                  <p className="text-xl text-slate-400 font-medium">Select the path that matches your professional soul.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {CATEGORIES.map((cat) => (
                    <CategoryCard 
                      key={cat.id} id={cat.id} icon={cat.icon} description={cat.description} 
                      color={cat.color} bgLight={cat.bgLight} selected={state.data.category === cat.id} 
                      onSelect={(id) => setState(prev => ({ ...prev, data: { ...prev.data, category: id }, view: 'editor' }))} 
                    />
                  ))}
                </div>
              </div>
            )}

            {state.view === 'editor' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                  <button onClick={() => setState(prev => ({...prev, view: 'landing'}))} className="group inline-flex items-center gap-3 text-sm font-bold text-slate-400 hover:text-indigo-600 mb-12 transition-colors">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="uppercase tracking-widest text-[10px] font-black">Back to Domain</span>
                  </button>
                  <EditorForm data={state.data} onChange={updateData} onNext={() => setState(prev => ({...prev, view: 'theme-selection'}))} />
                </div>
                <div className="lg:col-span-4 hidden lg:block">
                  <div className="sticky top-32 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl">
                    <h4 className="font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 italic mb-8 text-lg"><Monitor size={24} className="text-indigo-600" /> Live Preview</h4>
                    <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden border-4 border-slate-900 bg-slate-50 relative">
                      <div className="scale-[0.38] origin-top-left w-[263%] h-[263%]"><PortfolioPreview data={state.data} theme={state.theme} /></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {state.view === 'theme-selection' && (
              <div className="space-y-12">
                <div className="mb-12">
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase flex items-center gap-6"><Palette size={32} className="text-indigo-600" />Visual Aesthetic</h2>
                  <p className="text-xl text-slate-400 font-medium">Choose a layout that resonates with your brand identity.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                  {(['minimal', 'modern', 'glass', 'bold', 'classic', 'vibrant'] as Theme[]).map((t) => (
                    <div key={t} onClick={() => setTheme(t)} className={`group cursor-pointer p-8 rounded-[3rem] border-4 transition-all relative ${state.theme === t ? 'border-indigo-600 bg-white shadow-2xl scale-[1.03]' : 'border-white bg-white/40 hover:border-slate-100'}`}>
                      <div className="flex justify-between items-start mb-8"><h3 className="text-xl font-black uppercase tracking-tighter italic">{t}</h3>{state.theme === t && <Check className="text-indigo-600" size={24}/>}</div>
                      <div className="aspect-[4/3] rounded-[1.5rem] overflow-hidden border-2 border-slate-100 bg-slate-50 relative">
                        <div className="scale-[0.25] origin-top-left w-[400%] h-[400%]"><PortfolioPreview data={state.data} theme={t} /></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center pt-10"><button onClick={() => setState(prev => ({...prev, view: 'preview'}))} className="group bg-slate-900 text-white px-16 py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm shadow-3xl hover:-translate-y-2 transition-all flex items-center gap-6">LAUNCH PREVIEW <Eye size={20}/></button></div>
              </div>
            )}

            {state.view === 'profile' && (
              <div className="space-y-12">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
                  <div className="flex-1">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter italic uppercase flex items-center gap-6"><LayoutDashboard size={32} className="text-indigo-600" />Studio Dashboard</h2>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed truncate">Active Portal: <span className="text-indigo-600 font-black italic">{userEmail}</span></p>
                  </div>
                  <div className="flex items-center gap-6 bg-white px-8 py-6 rounded-[2.5rem] border border-slate-100 shadow-sm w-full lg:w-auto">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center animate-pulse"><Activity size={24}/></div>
                    <div><span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Sync Status</span><p className="text-sm font-black text-slate-900 uppercase italic">Cloud Verified</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <button onClick={() => setState(prev => ({...prev, view: 'editor'}))} className="group p-12 bg-white rounded-[3rem] border-4 border-transparent hover:border-indigo-600 shadow-2xl transition-all text-left">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-10"><Edit3 size={32}/></div>
                    <h3 className="text-3xl font-black uppercase italic mb-4">Edit Content</h3>
                    <p className="text-slate-400">Refine your projects and narrative narrative.</p>
                  </button>
                  <button onClick={() => setState(prev => ({...prev, view: 'theme-selection'}))} className="group p-12 bg-white rounded-[3rem] border-4 border-transparent hover:border-rose-500 shadow-2xl transition-all text-left">
                    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mb-10"><Palette size={32}/></div>
                    <h3 className="text-3xl font-black uppercase italic mb-4">Aesthetics</h3>
                    <p className="text-slate-400">Switch themes and vibrant layouts.</p>
                  </button>
                </div>
              </div>
            )}

            {state.view === 'preview' && (
              <div className="relative">
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-3xl px-12 py-8 rounded-[4rem] shadow-2xl border border-white/50 w-[95%] max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <button onClick={() => setState(prev => ({...prev, view: 'theme-selection'}))} className="w-16 h-16 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-[1.8rem] transition-all"><ArrowLeft size={24}/></button>
                    <div><h5 className="font-black uppercase tracking-tighter text-2xl italic leading-none">Status</h5><p className="text-xs font-bold text-slate-400 italic mt-1">{userId ? 'Cloud Sync Active' : 'Offline Export'}</p></div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    {!hasPublished ? (
                      <button onClick={handlePublish} disabled={isPublishing} className="flex-1 md:flex-none px-12 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-[1.8rem] text-sm font-black uppercase tracking-widest shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-4">
                        {isPublishing ? <Loader2 className="animate-spin" size={20}/> : <Zap size={20}/>} {userId && isSupabaseConfigured ? 'SYNC & PUBLISH' : 'PREPARE PORTAL'}
                      </button>
                    ) : (
                      <div className="flex gap-4 w-full">
                        <button onClick={handleDownload} className="flex-1 px-8 py-5 bg-slate-900 text-white rounded-[1.8rem] text-xs font-black uppercase shadow-xl flex items-center justify-center gap-2"><Download size={16}/> HTML</button>
                        <button onClick={handleShare} className={`flex-1 px-8 py-5 rounded-[1.8rem] text-xs font-black uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'}`}>
                          {copied ? <Check size={20}/> : <Share2 size={20}/>} {copied ? 'COPIED' : 'SHARE'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-h-screen"><PortfolioPreview data={state.data} theme={state.theme} /></div>
                <div className="h-64"></div>
              </div>
            )}
          </main>
          
          {state.view !== 'preview' && (
            <footer className="bg-white border-t border-slate-100 py-32 px-8 text-center mt-auto">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-[1.2rem] flex items-center justify-center shadow-xl"><Rocket size={24}/></div>
                  <h1 className="text-3xl font-black tracking-tighter leading-none text-slate-900 italic">FreelancePortfolio</h1>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-12">
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400"><ShieldCheck size={16} className="text-emerald-500"/> {userId && isSupabaseConfigured ? 'CLOUD PROTECTED' : 'LOCAL PRIVACY ENFORCED'}</div>
                </div>
              </div>
            </footer>
          )}
        </>
      )}
    </div>
  );
}
