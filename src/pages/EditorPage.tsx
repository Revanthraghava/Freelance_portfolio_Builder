
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import { generateBio, generateTagline, recommendSkills } from '../services/aiService';
import { PortfolioData, Skill, Project } from '../types';
import { CATEGORIES, TEMPLATES, INITIAL_DATA } from '../constants';
import { 
  ArrowLeft, ArrowRight, Save, Sparkles, Plus, Trash2, Layout, 
  User, Mail, MapPin, Star, Briefcase, Image as ImageIcon,
  Link as LinkIcon, Github, Linkedin, ExternalLink,
  Twitter, Instagram, Loader2, CheckCircle, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'projects' | 'template'>('info');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');

  const tabs = ['info', 'skills', 'projects', 'template'] as const;

  const goToNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (id) {
      portfolioService.getPortfolioById(id).then(p => {
        setData(p.content);
        setLoading(false);
      }).catch(() => navigate('/dashboard'));
    }
  }, [id, navigate]);

  const handleSave = async (shouldNavigateToPreview = false) => {
    setSaving(true);
    try {
      let currentId = id;
      if (id) {
        await portfolioService.updatePortfolio(id, data);
      } else {
        const result = await portfolioService.createPortfolio(data);
        currentId = result.id;
        navigate(`/editor/${currentId}`, { replace: true });
      }

      if (shouldNavigateToPreview && currentId) {
        window.open(`/preview/${currentId}`, '_blank');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!data.name || !data.category) {
      alert('Please enter your name and category first.');
      return;
    }
    setIsGenerating(true);
    const bio = await generateBio(
      data.name, 
      data.category, 
      data.skills.map(s => s.name), 
      'Intermediate'
    );
    setData({ ...data, bio });
    setIsGenerating(false);
  };

  const handleGenerateTagline = async () => {
    if (!data.name || !data.category) return;
    setIsGenerating(true);
    const tagline = await generateTagline(data.name, data.category);
    setData({ ...data, tagline });
    setIsGenerating(false);
  };

  const handleRecommendSkills = async () => {
    if (!data.category) return;
    setIsGenerating(true);
    const recommended = await recommendSkills(data.category);
    const existingNames = new Set(data.skills.map(s => s.name.toLowerCase()));
    const newSkills: Skill[] = recommended
      .filter(name => !existingNames.has(name.toLowerCase()))
      .map(name => ({ id: Math.random().toString(36).substr(2, 9), name, level: 80 }));
    
    setData({ ...data, skills: [...data.skills, ...newSkills] });
    setIsGenerating(false);
  };

  const addSkill = (name?: string) => {
    const skillName = name || newSkillName;
    if (!skillName.trim()) return;
    const newSkill: Skill = { id: Date.now().toString(), name: skillName, level: 80 };
    setData({ ...data, skills: [...data.skills, newSkill] });
    setNewSkillName('');
  };

  const updateSkill = (id: string, name: string, level: number) => {
    setData({
      ...data,
      skills: data.skills.map(s => s.id === id ? { ...s, name, level } : s)
    });
  };

  const removeSkill = (id: string) => {
    setData({ ...data, skills: data.skills.filter(s => s.id !== id) });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: 'https://picsum.photos/seed/' + Date.now() + '/600/400',
      link: ''
    };
    setData({ ...data, projects: [...data.projects, newProject] });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setData({
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const removeProject = (id: string) => {
    setData({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const handleImageUpload = (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProject(projectId, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl flex items-center justify-center transition-all">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tighter italic">Portfolio Architect</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Editing: {data.name || 'Untitled'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleSave(true)} 
              disabled={saving}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <ExternalLink size={16} />} Save & Preview
            </button>
            <button 
              onClick={() => handleSave(false)} 
              disabled={saving}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-3"
            >
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-12 p-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto">
          {(['info', 'skills', 'projects', 'template'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-12"
          >
            {activeTab === 'info' && (
              <div className="space-y-10">
                <SectionHeader icon={<User />} title="Personal Identity" subtitle="Define how the world sees you." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input label="Full Name" value={data.name} onChange={v => setData({...data, name: v})} placeholder="Elena Vasilev" icon={<User size={18}/>} />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Profession Category</label>
                    <select 
                      value={data.category} 
                      onChange={e => setData({...data, category: e.target.value as PortfolioData['category']})}
                      className="w-full px-8 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <Input label="Location" value={data.location} onChange={v => setData({...data, location: v})} placeholder="Berlin, Germany" icon={<MapPin size={18}/>} />
                  <Input label="Email Address" value={data.email} onChange={v => setData({...data, email: v})} placeholder="elena@studio.com" icon={<Mail size={18}/>} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <SectionHeader icon={<Sparkles />} title="Professional Narrative" subtitle="AI-enhanced bio and tagline." />
                    <button 
                      onClick={handleGenerateBio} 
                      disabled={isGenerating}
                      className="mb-4 text-indigo-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:underline disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>} Generate with AI
                    </button>
                  </div>
                  <textarea 
                    value={data.bio} 
                    onChange={e => setData({...data, bio: e.target.value})}
                    placeholder="Tell your story..."
                    className="w-full px-8 py-6 rounded-[2rem] border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium min-h-[150px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-end mb-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tagline</label>
                      <button onClick={handleGenerateTagline} className="text-indigo-600 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:underline">
                        <Sparkles size={14}/> AI Tagline
                      </button>
                    </div>
                    <input 
                      value={data.tagline} 
                      onChange={e => setData({...data, tagline: e.target.value})}
                      placeholder="e.g. Crafting digital experiences that matter."
                      className="w-full px-8 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold"
                    />
                  </div>
                </div>

                <SectionHeader icon={<LinkIcon />} title="Social Connections" subtitle="Where can people find you?" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="LinkedIn" value={data.socials.linkedin || ''} onChange={v => setData({...data, socials: {...data.socials, linkedin: v}})} placeholder="linkedin.com/in/..." icon={<Linkedin size={18}/>} />
                  <Input label="GitHub" value={data.socials.github || ''} onChange={v => setData({...data, socials: {...data.socials, github: v}})} placeholder="github.com/..." icon={<Github size={18}/>} />
                  <Input label="Twitter" value={data.socials.twitter || ''} onChange={v => setData({...data, socials: {...data.socials, twitter: v}})} placeholder="twitter.com/..." icon={<Twitter size={18}/>} />
                  <Input label="Instagram" value={data.socials.instagram || ''} onChange={v => setData({...data, socials: {...data.socials, instagram: v}})} placeholder="instagram.com/..." icon={<Instagram size={18}/>} />
                </div>

                <div className="pt-10 flex justify-end">
                  <button 
                    onClick={goToNextTab}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-indigo-600 transition-all group"
                  >
                    Continue to Skills <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <SectionHeader icon={<Star />} title="Core Arsenal" subtitle="Your technical and creative tools." />
                  <div className="flex gap-3">
                    <button 
                      onClick={handleRecommendSkills} 
                      disabled={isGenerating}
                      className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-indigo-100 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>} AI Recommend
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <div className="flex gap-4">
                    <input 
                      value={newSkillName}
                      onChange={e => setNewSkillName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSkill()}
                      placeholder="Type a skill (e.g. React, Figma, Python)..."
                      className="flex-1 px-8 py-5 rounded-2xl border border-slate-200 bg-white outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold"
                    />
                    <button 
                      onClick={() => addSkill()}
                      className="bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {data.skills.map(skill => (
                    <div key={skill.id} className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
                      <div className="flex-1 font-black text-slate-900 px-2">{skill.name}</div>
                      <div className="flex items-center gap-4 w-full md:w-64">
                        <input 
                          type="range" min="0" max="100" 
                          value={skill.level} 
                          onChange={e => updateSkill(skill.id, skill.name, parseInt(e.target.value))}
                          className="flex-1 accent-indigo-600"
                        />
                        <span className="text-xs font-black text-indigo-600 w-8">{skill.level}%</span>
                      </div>
                      <button onClick={() => removeSkill(skill.id)} className="text-rose-500 hover:bg-rose-50 p-3 rounded-xl transition-all">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  ))}
                  {data.skills.length === 0 && <p className="text-center py-12 text-slate-400 font-medium italic">No skills added yet. Start building your arsenal.</p>}
                </div>

                <div className="pt-10 flex justify-end">
                  <button 
                    onClick={goToNextTab}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-indigo-600 transition-all group"
                  >
                    Continue to Projects <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-10">
                <div className="flex justify-between items-center">
                  <SectionHeader icon={<Briefcase />} title="Featured Works" subtitle="Showcase your best projects." />
                  <button onClick={addProject} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-indigo-600 transition-all">
                    <Plus size={16}/> New Project
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-12">
                  {data.projects.map(project => (
                    <div key={project.id} className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-4 aspect-video md:aspect-auto bg-slate-200 relative group">
                          <img src={project.image} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
                            <label className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest cursor-pointer flex items-center gap-2">
                              <Upload size={14}/> Upload Local
                              <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(project.id, e)} />
                            </label>
                            <button onClick={() => {
                              const url = prompt('Enter image URL:', project.image);
                              if (url) updateProject(project.id, { image: url });
                            }} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                              <ImageIcon size={14}/> URL
                            </button>
                          </div>
                        </div>
                        <div className="md:col-span-8 p-8 space-y-6">
                          <div className="flex justify-between items-start">
                            <input 
                              value={project.title} 
                              onChange={e => updateProject(project.id, { title: e.target.value })}
                              placeholder="Project Title"
                              className="text-2xl font-black bg-transparent border-b-2 border-transparent focus:border-indigo-600 outline-none w-full mr-4"
                            />
                            <button onClick={() => removeProject(project.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg"><Trash2 size={18}/></button>
                          </div>
                          <textarea 
                            value={project.description} 
                            onChange={e => updateProject(project.id, { description: e.target.value })}
                            placeholder="Describe the project outcome and your role..."
                            className="w-full bg-white px-6 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 font-medium min-h-[100px]"
                          />
                          <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                            <input 
                              value={project.link} 
                              onChange={e => updateProject(project.id, { link: e.target.value })}
                              placeholder="Project Link (URL)"
                              className="w-full pl-12 pr-6 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.projects.length === 0 && <p className="text-center py-12 text-slate-400 font-medium italic">No projects added yet. Showcase your impact.</p>}
                </div>

                <div className="pt-10 flex justify-end">
                  <button 
                    onClick={goToNextTab}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-indigo-600 transition-all group"
                  >
                    Continue to Template <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'template' && (
              <div className="space-y-10">
                <SectionHeader icon={<Layout />} title="Visual Aesthetic" subtitle="Choose a layout that resonates with your brand." />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {TEMPLATES.map(template => (
                    <div 
                      key={template.id}
                      onClick={() => setData({...data, templateId: template.id})}
                      className={`group cursor-pointer rounded-[2.5rem] border-4 transition-all overflow-hidden relative ${data.templateId === template.id ? 'border-indigo-600 shadow-2xl scale-[1.02]' : 'border-slate-100 hover:border-indigo-200'}`}
                    >
                      <div className="aspect-video bg-slate-100">
                        <img src={template.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="p-8 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-black italic">{template.name}</h3>
                          {data.templateId === template.id && <CheckCircle className="text-indigo-600" size={24} />}
                        </div>
                        <p className="text-slate-500 text-sm font-medium">{template.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-10 flex justify-end">
                  <button 
                    onClick={() => handleSave(true)}
                    disabled={saving}
                    className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
                  >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />} Finalize & Launch
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
      </div>
      <div>
        <h3 className="text-xl font-black uppercase tracking-tighter italic leading-none">{title}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, icon }: { label: string, value: string, onChange: (v: string) => void, placeholder: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{label}</label>
      <div className="relative">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </div>
        <input 
          value={value} 
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-16 pr-8 py-5 rounded-[1.5rem] border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all font-semibold"
        />
      </div>
    </div>
  );
}
