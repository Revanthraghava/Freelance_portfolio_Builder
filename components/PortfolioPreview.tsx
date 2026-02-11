
import React from 'react';
import { PortfolioData, Theme, Category } from '../types';
import { Mail, MapPin, ExternalLink, ArrowRight, Play, Globe, GraduationCap, Award } from 'lucide-react';
import { SOCIAL_ICONS, CATEGORIES } from '../constants';

interface PortfolioPreviewProps {
  data: PortfolioData;
  theme: Theme;
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ data, theme }) => {
  const themeStyles = {
    minimal: {
      container: 'bg-white font-sans text-gray-800',
      header: 'py-16 md:py-24 px-6 md:px-8 text-center',
      title: 'text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight',
      tagline: 'text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed',
      section: 'max-w-6xl mx-auto py-12 md:py-20 px-6 md:px-8',
      card: 'group overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 transition-all hover:border-gray-200',
      skill: 'bg-gray-100 text-gray-600 border border-gray-200',
      creds: 'bg-white border border-gray-100 p-6 rounded-2xl'
    },
    modern: {
      container: 'bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30 min-h-screen',
      header: 'py-20 md:py-32 px-6 md:px-8 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-center',
      title: 'text-4xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-6 leading-tight',
      tagline: 'text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed',
      section: 'max-w-7xl mx-auto py-16 md:py-24 px-6 md:px-8',
      card: 'group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500',
      skill: 'bg-slate-800 text-slate-300 border border-slate-700',
      creds: 'bg-slate-900/50 border border-slate-800 p-8 rounded-3xl'
    },
    glass: {
      container: 'bg-indigo-600 font-sans text-white min-h-screen relative overflow-hidden',
      header: 'py-20 md:py-32 px-6 md:px-8 text-center relative z-10',
      title: 'text-4xl md:text-7xl font-bold tracking-tight mb-4 drop-shadow-xl leading-tight',
      tagline: 'text-base md:text-xl text-indigo-100/90 max-w-2xl mx-auto backdrop-blur-md bg-white/10 py-3 px-6 rounded-2xl md:rounded-full inline-block leading-relaxed',
      section: 'max-w-5xl mx-auto py-16 md:py-24 px-6 md:px-8 relative z-10',
      card: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden transition-transform hover:scale-[1.02]',
      skill: 'bg-white/20 text-white border border-white/30 backdrop-blur-sm',
      creds: 'bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] md:rounded-[2.5rem]'
    },
    bold: {
      container: 'bg-yellow-400 font-sans text-black min-h-screen',
      header: 'py-16 md:py-24 px-6 md:px-8 border-b-4 border-black',
      title: 'text-5xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none',
      tagline: 'text-lg md:text-2xl font-bold bg-white inline-block px-4 py-2 border-2 md:border-4 border-black',
      section: 'max-w-7xl mx-auto py-12 md:py-20 px-6 md:px-8',
      card: 'bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all',
      skill: 'bg-black text-white px-4 py-2 font-bold uppercase tracking-widest text-[10px] md:text-xs',
      creds: 'bg-white border-4 border-black p-6 md:p-8 rounded-none'
    },
    classic: {
      container: 'bg-stone-50 font-serif text-stone-900 min-h-screen',
      header: 'py-20 md:py-32 px-6 md:px-8 text-center max-w-4xl mx-auto border-b border-stone-200',
      title: 'text-4xl md:text-7xl font-normal italic mb-6 leading-tight',
      tagline: 'text-xl md:text-3xl text-stone-600 font-light leading-relaxed',
      section: 'max-w-4xl mx-auto py-16 md:py-24 px-6 md:px-8',
      card: 'mb-12 md:mb-20 pb-12 md:pb-20 border-b border-stone-200 last:border-0',
      skill: 'bg-transparent border-stone-300 border-b italic px-2 py-1 text-sm md:text-base',
      creds: 'border-l-2 border-stone-200 pl-6 md:pl-8 py-4 mb-8'
    },
    vibrant: {
      container: 'bg-rose-50 font-sans text-rose-950 min-h-screen',
      header: 'py-20 md:py-32 px-6 md:px-8 text-center bg-gradient-to-br from-rose-100 to-orange-50',
      title: 'text-4xl md:text-7xl font-black italic tracking-tighter text-rose-600 mb-4 leading-tight',
      tagline: 'text-sm md:text-xl text-rose-800/70 max-w-2xl mx-auto font-bold uppercase tracking-widest leading-relaxed',
      section: 'max-w-6xl mx-auto py-16 md:py-24 px-6 md:px-8',
      card: 'group bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border-4 border-rose-100 shadow-xl shadow-rose-200/50 hover:border-orange-200 transition-all duration-500',
      skill: 'bg-rose-100 text-rose-600 border border-rose-200 rounded-full font-bold text-xs px-4 py-2',
      creds: 'bg-rose-50 border-2 border-rose-200 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem]'
    }
  }[theme];

  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderMedia = (url: string, title: string) => {
    if (!url) {
      const categoryIcon = CATEGORIES.find(c => c.id === data.category)?.icon;
      return (
        <div className="w-full h-full bg-current/5 flex items-center justify-center text-current/20">
          {categoryIcon || <Globe size={40} />}
        </div>
      );
    }

    if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) || url.includes('images.unsplash.com') || url.includes('picsum.photos')) {
      return (
        <img 
          src={url} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      );
    }

    const ytId = getYoutubeEmbed(url);
    if (ytId) {
      return (
        <iframe 
          className="w-full h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${ytId}?controls=0&mute=1&autoplay=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }

    return (
      <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex flex-col items-center justify-center gap-2 p-6">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <Globe size={24} className="text-current" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">View Link</span>
      </div>
    );
  };

  return (
    <div className={`${themeStyles.container} transition-colors duration-500`}>
      {/* Header */}
      <header className={themeStyles.header}>
        {theme === 'glass' && (
          <>
            <div className="absolute top-[-10%] left-[-5%] w-48 md:w-72 h-48 md:h-72 bg-purple-400 rounded-full blur-[80px] md:blur-[100px] opacity-30"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-64 md:w-96 h-64 md:h-96 bg-blue-400 rounded-full blur-[100px] md:blur-[120px] opacity-30"></div>
          </>
        )}
        <h1 className={themeStyles.title}>{data.fullName || 'Your Name'}</h1>
        <p className={themeStyles.tagline}>{data.tagline || 'Your tagline here...'}</p>
        
        <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
          {Object.entries(data.socials).map(([key, val]) => (
            val && (
              <a 
                key={key} 
                href={val} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 border border-current/20 hover:bg-current/10"
              >
                {(SOCIAL_ICONS as any)[key]}
              </a>
            )
          ))}
        </div>
      </header>

      {/* About Section */}
      <section className={themeStyles.section}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Identity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-current/5 flex items-center justify-center"><Mail size={18} className="opacity-40" /></div>
                  <span className="font-semibold text-sm md:text-base break-all">{data.email || 'hello@yourdomain.com'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-current/5 flex items-center justify-center"><MapPin size={18} className="opacity-40" /></div>
                  <span className="font-semibold text-sm md:text-base">{data.location || 'Remote'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-6">Mastery</h2>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {data.skills.map((s, i) => (
                  <span key={i} className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold tracking-wide ${themeStyles.skill}`}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 order-1 lg:order-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-6">The Narrative</h2>
            <p className="text-xl md:text-3xl leading-relaxed md:leading-snug font-medium opacity-90 whitespace-pre-wrap">
              {data.about || "Your professional journey starts here. Describe your vision, process, and creative philosophy."}
            </p>
          </div>
        </div>
      </section>

      {/* Credentials */}
      {(data.qualifications?.length > 0 || data.certifications?.length > 0) && (
        <section className={`${themeStyles.section} !pt-0`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {data.qualifications?.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-8 flex items-center gap-3">
                  <GraduationCap size={18} /> Education
                </h2>
                <div className="space-y-6">
                  {data.qualifications.map((q) => (
                    <div key={q.id} className={themeStyles.creds}>
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h3 className="font-black text-lg md:text-xl leading-tight">{q.degree}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-current/5 px-2 py-1 rounded-md shrink-0">{q.year}</span>
                      </div>
                      <p className="font-medium opacity-60 text-sm md:text-base">{q.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.certifications?.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-8 flex items-center gap-3">
                  <Award size={18} /> Certifications
                </h2>
                <div className="space-y-6">
                  {data.certifications.map((c) => (
                    <div key={c.id} className={themeStyles.creds}>
                      <div className="flex justify-between items-start mb-2 gap-4">
                        <h3 className="font-black text-lg md:text-xl leading-tight">{c.name}</h3>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-current/5 px-2 py-1 rounded-md shrink-0">{c.date}</span>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="font-medium opacity-60 text-sm md:text-base">{c.issuer}</p>
                        {c.link && (
                          <a href={c.link} target="_blank" rel="noopener" className="w-8 h-8 rounded-lg bg-current/5 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Work Grid */}
      <section className={`${themeStyles.section} !pt-0`}>
        <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-12 flex items-center gap-3">
           Selected Works
        </h2>
        
        {theme === 'classic' ? (
          <div className="space-y-16 md:space-y-24">
            {data.projects.map((proj) => (
              <div key={proj.id} className={themeStyles.card}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden group shadow-lg">
                    {renderMedia(proj.link, proj.title)}
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-3xl md:text-5xl font-normal italic leading-tight">{proj.title}</h3>
                    <p className="text-lg md:text-xl text-stone-600 leading-relaxed italic">{proj.description}</p>
                    <div className="flex flex-wrap gap-4">
                      {proj.tags.map((t, i) => <span key={i} className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 border-b border-stone-200 pb-1">{t}</span>)}
                    </div>
                    {proj.link && (
                      <a 
                        href={proj.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-3 text-stone-900 font-black uppercase tracking-widest text-xs border-b-2 border-stone-900 pb-2 hover:opacity-70 transition-opacity"
                      >
                        Explore <ArrowRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {data.projects.map((proj) => (
              <div key={proj.id} className={themeStyles.card}>
                <div className="aspect-video relative overflow-hidden bg-current/5 group">
                  {renderMedia(proj.link, proj.title)}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {proj.link && (
                      <a 
                        href={proj.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white text-black p-4 rounded-2xl translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl"
                      >
                        <ExternalLink size={24} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[9px] font-black uppercase tracking-[0.15em] opacity-40 border border-current/10 px-2 py-1 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black leading-tight tracking-tight">{proj.title}</h3>
                  <p className="text-sm md:text-base opacity-60 leading-relaxed line-clamp-3">{proj.description}</p>
                  <div className="pt-4 border-t border-current/10 flex justify-between items-center group-hover:text-current/100">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-all">
                      Case Study
                    </span>
                    <ArrowRight size={18} className="-translate-x-4 group-hover:translate-x-0 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.projects.length === 0 && (
          <div className="text-center py-20 bg-current/5 rounded-[2rem] border-2 border-dashed border-current/10 px-6">
            <p className="opacity-40 italic font-medium">Add your signature projects to populate this gallery.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 text-center border-t border-current/10 bg-current/2">
        <div className="max-w-xl mx-auto space-y-4">
           <h2 className="text-lg font-black italic tracking-tighter opacity-80">{data.fullName || 'FreelancePortfolio'}</h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">© {new Date().getFullYear()} Studio Portal • Engineered for Creatives</p>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPreview;
