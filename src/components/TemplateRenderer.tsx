
import React from 'react';
import { PortfolioData } from '../types';
import { 
  Github, Linkedin, 
  ExternalLink, Mail, MapPin, 
  ArrowRight
} from 'lucide-react';

interface Props {
  data: PortfolioData;
}

export default function TemplateRenderer({ data }: Props) {
  switch (data.templateId) {
    case 'minimal-dev':
      return <MinimalTemplate data={data} />;
    case 'creative-designer':
      return <CreativeTemplate data={data} />;
    case 'pro-freelancer':
      return <ProfessionalTemplate data={data} />;
    case 'modern-dark':
      return <ModernDarkTemplate data={data} />;
    default:
      return <MinimalTemplate data={data} />;
  }
}

function ModernDarkTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500">
      {/* Nav */}
      <nav className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center border-b border-white/5">
        <span className="text-xl font-black tracking-tighter text-indigo-500">{data.name}</span>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
            {data.tagline || `Building the future as a ${data.category}.`}
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed mb-12">
            {data.bio}
          </p>
          <div className="flex gap-4">
            {data.socials.github && (
              <a href={data.socials.github} className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all">
                GitHub
              </a>
            )}
            {data.socials.linkedin && (
              <a href={data.socials.linkedin} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all border border-white/10">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="about" className="max-w-7xl mx-auto px-6 py-40 border-t border-white/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-20">Core Expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {data.skills.map(skill => (
            <div key={skill.id} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="font-black text-lg italic">{skill.name}</span>
                <span className="text-[10px] font-bold text-slate-500">{skill.level}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-7xl mx-auto px-6 py-40 border-t border-white/5">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-20">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.map(project => (
            <div key={project.id} className="group bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-indigo-500/50 transition-all">
              <div className="aspect-video overflow-hidden">
                <img src={project.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-10">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">
                  <h3 className="text-2xl font-black mb-4">{project.title}</h3>
                </a>
                <p className="text-slate-400 font-medium mb-8 line-clamp-2">{project.description}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-500 font-black uppercase tracking-widest text-[10px] hover:gap-4 transition-all">
                  View Project <ArrowRight size={16}/>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="bg-slate-900/50 py-40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-4 italic">Ready to collaborate?</h2>
            <p className="text-slate-400 font-medium">Let's turn your vision into reality.</p>
          </div>
          <a href={`mailto:${data.email}`} className="bg-indigo-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all">
            Get In Touch
          </a>
        </div>
      </footer>
    </div>
  );
}

function MinimalTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 h-24 flex justify-between items-center border-b border-slate-50">
        <span className="text-xl font-black tracking-tighter">{data.name}</span>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
          <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
          <a href="#projects" className="hover:text-indigo-600 transition-colors">Projects</a>
          <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-32">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none italic">
          {data.tagline || `I'm a ${data.category}.`}
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl font-medium leading-relaxed">
          {data.bio}
        </p>
        <div className="flex gap-6 mt-12">
          {data.socials.github && <a href={data.socials.github} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"><Github size={20}/></a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"><Linkedin size={20}/></a>}
        </div>
      </section>

      {/* Skills */}
      <section id="about" className="bg-slate-50 py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-12">Core Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {data.skills.map(skill => (
              <div key={skill.id} className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="font-black text-lg italic">{skill.name}</span>
                  <span className="text-[10px] font-bold text-slate-400">{skill.level}%</span>
                </div>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600 mb-12">Selected Works</h2>
          <div className="grid grid-cols-1 gap-24">
            {data.projects.map((project, i) => (
              <div key={project.id} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}>
                <div className="flex-1 aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
                  <img src={project.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-6">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                    <h3 className="text-4xl font-black tracking-tight">{project.title}</h3>
                  </a>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed">{project.description}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                    View Project <ArrowRight size={16}/>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className="bg-slate-900 text-white py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-12 italic">Let's build something <br/> remarkable together.</h2>
          <a href={`mailto:${data.email}`} className="text-2xl md:text-3xl font-bold text-indigo-400 hover:text-white transition-colors underline underline-offset-8">
            {data.email}
          </a>
          <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:row justify-between items-center gap-8">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">© {new Date().getFullYear()} {data.name} — All Rights Reserved</span>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
              {data.socials.twitter && <a href={data.socials.twitter} className="hover:text-white">Twitter</a>}
              {data.socials.instagram && <a href={data.socials.instagram} className="hover:text-white">Instagram</a>}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CreativeTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-rose-500 selection:text-white">
      {/* Floating Nav */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full z-50 flex gap-8 text-[10px] font-black uppercase tracking-widest">
        <a href="#hero" className="hover:text-rose-500 transition-colors">Home</a>
        <a href="#work" className="hover:text-rose-500 transition-colors">Work</a>
        <a href="#about" className="hover:text-rose-500 transition-colors">About</a>
        <a href="#contact" className="hover:text-rose-500 transition-colors">Contact</a>
      </nav>

      {/* Hero */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/20 blur-[120px] rounded-full -z-10"></div>
        <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-xs mb-8">Creative {data.category}</span>
        <h1 className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.85] mb-12 italic">
          {(data.name || '').split(' ')[0]} <br/> {(data.name || '').split(' ')[1] || ''}
        </h1>
        <p className="text-xl md:text-2xl text-white/60 max-w-2xl font-medium leading-relaxed">
          {data.tagline}
        </p>
      </section>

      {/* Work Grid */}
      <section id="work" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {data.projects.map((project, i) => (
              <div key={project.id} className={`group relative aspect-[4/5] overflow-hidden rounded-[3rem] ${i % 3 === 0 ? 'md:col-span-2 aspect-video' : ''}`}>
                <img src={project.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-12 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-rose-500 transition-colors">
                    <h3 className="text-4xl font-black mb-4">{project.title}</h3>
                  </a>
                  <p className="text-white/60 font-medium mb-8 max-w-md">{project.description}</p>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <ExternalLink size={24}/>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-32 px-6 bg-white text-black rounded-[5rem]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div>
              <h2 className="text-6xl font-black tracking-tighter mb-12 italic">The Story.</h2>
              <p className="text-2xl font-medium leading-relaxed text-black/70">{data.bio}</p>
            </div>
            <div className="space-y-12">
              <h2 className="text-6xl font-black tracking-tighter mb-12 italic">Skills.</h2>
              <div className="flex flex-wrap gap-4">
                {data.skills.map(skill => (
                  <span key={skill.id} className="px-8 py-4 bg-black text-white rounded-full text-sm font-black uppercase tracking-widest">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-32 px-6 text-center">
        <h2 className="text-5xl md:text-[8rem] font-black tracking-tighter mb-12 italic leading-none">Say Hello.</h2>
        <a href={`mailto:${data.email}`} className="text-3xl md:text-5xl font-black text-rose-500 hover:text-white transition-colors underline underline-offset-[12px]">
          {data.email}
        </a>
        <div className="mt-32 flex justify-center gap-12">
          {data.socials.instagram && <a href={data.socials.instagram} className="text-white/40 hover:text-rose-500 font-black uppercase tracking-widest text-xs">Instagram</a>}
          {data.socials.linkedin && <a href={data.socials.linkedin} className="text-white/40 hover:text-rose-500 font-black uppercase tracking-widest text-xs">LinkedIn</a>}
          {data.socials.twitter && <a href={data.socials.twitter} className="text-white/40 hover:text-rose-500 font-black uppercase tracking-widest text-xs">Twitter</a>}
        </div>
      </footer>
    </div>
  );
}

function ProfessionalTemplate({ data }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Layout */}
      <div className="flex flex-col lg:flex-row">
        <aside className="lg:w-96 lg:h-screen lg:sticky lg:top-0 bg-white border-r border-slate-100 p-12 flex flex-col justify-between">
          <div>
            <div className="w-24 h-24 bg-indigo-600 rounded-3xl mb-8 flex items-center justify-center text-white text-4xl font-black">
              {data.name.charAt(0)}
            </div>
            <h1 className="text-3xl font-black tracking-tighter mb-2">{data.name}</h1>
            <p className="text-indigo-600 font-black uppercase tracking-widest text-[10px] mb-8">{data.category}</p>
            
            <nav className="flex flex-col gap-4 mb-12">
              <a href="#about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">About</a>
              <a href="#skills" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Skills</a>
              <a href="#projects" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Projects</a>
            </nav>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-500">
                <Mail size={18}/> <span className="text-sm font-bold">{data.email}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <MapPin size={18}/> <span className="text-sm font-bold">{data.location}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            {data.socials.linkedin && <a href={data.socials.linkedin} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"><Linkedin size={18}/></a>}
            {data.socials.github && <a href={data.socials.github} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"><Github size={18}/></a>}
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-24 space-y-32">
          <section id="about">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-12">Executive Summary</h2>
            <p className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
              {data.bio}
            </p>
          </section>

          <section id="skills">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-12">Core Competencies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.skills.map(skill => (
                <div key={skill.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-lg">{skill.name}</span>
                    <span className="text-xs font-bold text-indigo-600">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="projects">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-12">Portfolio Highlights</h2>
            <div className="grid grid-cols-1 gap-12">
              {data.projects.map(project => (
                <div key={project.id} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="aspect-video bg-slate-100">
                      <img src={project.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-12 flex flex-col justify-center">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                        <h3 className="text-3xl font-black mb-4">{project.title}</h3>
                      </a>
                      <p className="text-slate-500 font-medium mb-8">{project.description}</p>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] self-start">
                        View Project <ExternalLink size={14}/>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
