
import React, { useState } from 'react';
import { PortfolioData, Skill, Project, Qualification, Certification } from '../types';
import { Plus, Trash2, Sparkles, Loader2, ArrowRight, Link as LinkIcon, Briefcase, MapPin, User, Mail, Star, Share2, Award, GraduationCap, Calendar } from 'lucide-react';
import { polishBio, generateTagline } from '../services/geminiService';

interface EditorFormProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
  onNext: () => void;
}

const EditorForm: React.FC<EditorFormProps> = ({ data, onChange, onNext }) => {
  const [isPolishing, setIsPolishing] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 80 });

  const updateField = (field: keyof PortfolioData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateSocial = (platform: string, value: string) => {
    onChange({ ...data, socials: { ...data.socials, [platform]: value } });
  };

  const handlePolishBio = async () => {
    if (!data.about || !data.fullName) return;
    setIsPolishing(true);
    const polished = await polishBio(data.about, data.category, data.fullName);
    updateField('about', polished);
    setIsPolishing(false);
  };

  const handleMagicTagline = async () => {
    if (!data.fullName) return;
    setIsPolishing(true);
    const tag = await generateTagline(data.fullName, data.category, data.skills.map(s => s.name));
    updateField('tagline', tag);
    setIsPolishing(false);
  };

  const addSkill = () => {
    if (!newSkill.name) return;
    updateField('skills', [...data.skills, newSkill]);
    setNewSkill({ name: '', level: 80 });
  };

  const removeSkill = (index: number) => {
    const newSkills = [...data.skills];
    newSkills.splice(index, 1);
    updateField('skills', newSkills);
  };

  const addProject = () => {
    const proj: Project = {
      id: Date.now().toString(),
      title: 'Untitled Project',
      description: 'Project outcome and role...',
      link: '',
      tags: [data.category]
    };
    updateField('projects', [...data.projects, proj]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const newProjects = data.projects.map(p => p.id === id ? { ...p, ...updates } : p);
    updateField('projects', newProjects);
  };

  const removeProject = (id: string) => {
    updateField('projects', data.projects.filter(p => p.id !== id));
  };

  const addQualification = () => {
    const qual: Qualification = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      year: ''
    };
    updateField('qualifications', [...(data.qualifications || []), qual]);
  };

  const updateQualification = (id: string, updates: Partial<Qualification>) => {
    const newQuals = data.qualifications.map(q => q.id === id ? { ...q, ...updates } : q);
    updateField('qualifications', newQuals);
  };

  const removeQualification = (id: string) => {
    updateField('qualifications', data.qualifications.filter(q => q.id !== id));
  };

  const addCertification = () => {
    const cert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: ''
    };
    updateField('certifications', [...(data.certifications || []), cert]);
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    const newCerts = data.certifications.map(c => c.id === id ? { ...c, ...updates } : c);
    updateField('certifications', newCerts);
  };

  const removeCertification = (id: string) => {
    updateField('certifications', data.certifications.filter(c => c.id !== id));
  };

  const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5";
  const inputStyle = "w-full px-5 py-4 rounded-2xl border border-indigo-50 bg-white/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all duration-300 text-gray-700 font-medium placeholder:text-gray-300";

  return (
    <div className="space-y-10 md:space-y-16">
      {/* Basic Info */}
      <section className="bg-white/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-white">
        <h2 className="text-xl md:text-2xl font-black mb-8 md:mb-10 flex items-center gap-3 tracking-tighter uppercase italic">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <User size={20} />
          </div>
          Identity & Core
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-1">
            <label className={labelStyle}><User size={12}/> Legal Name</label>
            <input 
              type="text" 
              value={data.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              className={inputStyle}
              placeholder="e.g. Elena Vasilev"
            />
          </div>
          <div className="space-y-1">
            <label className={labelStyle}><Mail size={12}/> Email Connection</label>
            <input 
              type="email" 
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputStyle}
              placeholder="hello@domain.com"
            />
          </div>
          <div className="space-y-1">
            <label className={labelStyle}><MapPin size={12}/> Location</label>
            <input 
              type="text" 
              value={data.location}
              onChange={(e) => updateField('location', e.target.value)}
              className={inputStyle}
              placeholder="e.g. New York, Remote"
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-1">
              <label className={labelStyle}><Sparkles size={12}/> The Hook (Tagline)</label>
              <button 
                onClick={handleMagicTagline}
                disabled={isPolishing || !data.fullName}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-lg disabled:opacity-50 transition-all self-start sm:self-auto"
              >
                {isPolishing ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                Generate AI Hook
              </button>
            </div>
            <input 
              type="text" 
              value={data.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              className={inputStyle}
              placeholder="Your professional mission in one punchy sentence..."
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-1">
              <label className={labelStyle}><Briefcase size={12}/> Narrative (About)</label>
              <button 
                onClick={handlePolishBio}
                disabled={isPolishing || !data.about}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-lg disabled:opacity-50 transition-all self-start sm:self-auto"
              >
                {isPolishing ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                Polish with Assistant
              </button>
            </div>
            <textarea 
              rows={5}
              value={data.about}
              onChange={(e) => updateField('about', e.target.value)}
              className={`${inputStyle} resize-none leading-relaxed min-h-[150px] md:min-h-0`}
              placeholder="Tell your story, your process, and your unique value..."
            />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-white">
        <h2 className="text-xl md:text-2xl font-black mb-8 md:mb-10 flex items-center gap-3 tracking-tighter uppercase italic">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Star size={20} />
          </div>
          Arsenal & Skills
        </h2>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-10">
          {data.skills.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 pr-1.5 md:pr-2 py-1.5 md:py-2 bg-white text-gray-800 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest border border-indigo-50 shadow-sm transition-all hover:border-indigo-200">
              {skill.name} <span className="text-indigo-500 font-bold">{skill.level}%</span>
              <button onClick={() => removeSkill(idx)} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
            </div>
          ))}
          {data.skills.length === 0 && <p className="text-sm text-gray-300 italic font-medium">Add your top tools and expertise...</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <input 
            type="text" 
            value={newSkill.name}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className={inputStyle}
            placeholder="e.g. Figma, React..."
          />
          <button 
            onClick={addSkill}
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-white">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 tracking-tighter uppercase italic">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <Briefcase size={20} />
            </div>
            Featured Works
          </h2>
          <button 
            onClick={addProject}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
          >
            <Plus size={16} /> New Entry
          </button>
        </div>
        
        <div className="space-y-8 md:space-y-10">
          {data.projects.map((project) => (
            <div key={project.id} className="group relative bg-white/60 p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border border-indigo-50 hover:border-indigo-300 transition-all duration-500 shadow-sm hover:shadow-xl">
              <button 
                onClick={() => removeProject(project.id)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
                <div className="md:col-span-4 space-y-4">
                  <div className="w-full aspect-video rounded-xl md:rounded-2xl bg-indigo-50/30 flex flex-col items-center justify-center text-indigo-300 border border-indigo-100/50 overflow-hidden">
                    {project.link ? (
                      <div className="flex flex-col items-center gap-3 text-center p-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                          <LinkIcon size={20} className="text-indigo-600" />
                        </div>
                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-400">Linked</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Awaiting Link</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={labelStyle}>Destination Link</label>
                    <input 
                      type="text"
                      value={project.link}
                      onChange={(e) => updateProject(project.id, { link: e.target.value })}
                      className="w-full px-4 py-3 text-xs rounded-xl border border-indigo-50 outline-none focus:border-indigo-400 bg-white font-medium"
                      placeholder="Image, Video, or URL"
                    />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-4 md:space-y-6">
                  <input 
                    type="text"
                    value={project.title}
                    onChange={(e) => updateProject(project.id, { title: e.target.value })}
                    className="text-xl md:text-2xl font-black tracking-tighter text-gray-900 bg-transparent w-full border-b-2 border-indigo-50 focus:border-indigo-500 outline-none pb-2 transition-all"
                    placeholder="Project Headline"
                  />
                  <textarea 
                    rows={3}
                    value={project.description}
                    onChange={(e) => updateProject(project.id, { description: e.target.value })}
                    className="w-full bg-transparent text-gray-500 font-medium leading-relaxed border-none outline-none focus:ring-0 resize-none p-0 text-sm md:text-base"
                    placeholder="Briefly explain the challenge..."
                  />
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="ADD TAG"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value.trim();
                            if (val) updateProject(project.id, { tags: [...project.tags, val] });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        className="text-[10px] font-black tracking-[0.2em] uppercase px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-indigo-50 border-none outline-none focus:bg-indigo-100 transition-colors w-24 md:w-32"
                      />
                    </div>
                    {project.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-black tracking-[0.2em] bg-white border border-indigo-50 px-3 py-1.5 rounded-xl text-indigo-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {data.projects.length === 0 && (
            <div className="text-center py-12 md:py-20 border-2 border-dashed border-indigo-100 rounded-[1.5rem] md:rounded-[2.5rem] bg-indigo-50/10 px-4">
              <p className="text-gray-400 font-medium text-sm">Click "New Entry" to showcase your best works.</p>
            </div>
          )}
        </div>
      </section>

      {/* Qualifications & Certifications */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        <div className="bg-white/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-white">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 tracking-tighter uppercase italic">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap size={20} />
              </div>
              Education
            </h2>
            <button 
              onClick={addQualification}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-4 md:space-y-6">
            {data.qualifications.map((q) => (
              <div key={q.id} className="relative bg-white/60 p-5 md:p-6 rounded-2xl border border-indigo-50">
                <button 
                  onClick={() => removeQualification(q.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 md:space-y-4">
                  <input 
                    type="text"
                    value={q.degree}
                    onChange={(e) => updateQualification(q.id, { degree: e.target.value })}
                    className="w-full bg-transparent font-bold text-gray-800 outline-none border-b border-indigo-50 focus:border-indigo-500 text-sm md:text-base"
                    placeholder="Degree/Qualification"
                  />
                  <input 
                    type="text"
                    value={q.institution}
                    onChange={(e) => updateQualification(q.id, { institution: e.target.value })}
                    className="w-full bg-transparent text-xs md:text-sm text-gray-600 outline-none"
                    placeholder="Institution/University"
                  />
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400">
                    <Calendar size={12} />
                    <input 
                      type="text"
                      value={q.year}
                      onChange={(e) => updateQualification(q.id, { year: e.target.value })}
                      className="bg-transparent outline-none uppercase tracking-widest w-full"
                      placeholder="Year (e.g. 2020)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-white">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <h2 className="text-xl md:text-2xl font-black flex items-center gap-3 tracking-tighter uppercase italic">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Award size={20} />
              </div>
              Certs
            </h2>
            <button 
              onClick={addCertification}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-4 md:space-y-6">
            {data.certifications.map((c) => (
              <div key={c.id} className="relative bg-white/60 p-5 md:p-6 rounded-2xl border border-indigo-50">
                <button 
                  onClick={() => removeCertification(c.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3 md:space-y-4">
                  <input 
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCertification(c.id, { name: e.target.value })}
                    className="w-full bg-transparent font-bold text-gray-800 outline-none border-b border-indigo-50 focus:border-indigo-500 text-sm md:text-base"
                    placeholder="Certification Name"
                  />
                  <input 
                    type="text"
                    value={c.issuer}
                    onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
                    className="w-full bg-transparent text-xs md:text-sm text-gray-600 outline-none"
                    placeholder="Issuing Organization"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
                     <div className="flex items-center gap-2 text-[10px] font-black text-gray-400">
                        <Calendar size={12} />
                        <input 
                          type="text"
                          value={c.date}
                          onChange={(e) => updateCertification(c.id, { date: e.target.value })}
                          className="bg-transparent outline-none uppercase tracking-widest w-full sm:w-20"
                          placeholder="Date"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400">
                        <LinkIcon size={12} />
                        <input 
                          type="text"
                          value={c.link || ''}
                          onChange={(e) => updateCertification(c.id, { link: e.target.value })}
                          className="bg-transparent outline-none uppercase tracking-widest placeholder:text-indigo-200 w-full"
                          placeholder="Verify Link"
                        />
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Socials */}
      <section className="bg-white/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-white">
        <h2 className="text-xl md:text-2xl font-black mb-8 md:mb-10 flex items-center gap-3 tracking-tighter uppercase italic">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Share2 size={20} />
          </div>
          Connectivity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {['LinkedIn', 'Github', 'Instagram', 'Twitter'].map((platform) => (
            <div key={platform} className="space-y-1">
              <label className={labelStyle}>{platform}</label>
              <input 
                type="text" 
                value={(data.socials as any)[platform.toLowerCase()] || ''}
                onChange={(e) => updateSocial(platform.toLowerCase(), e.target.value)}
                className={inputStyle}
                placeholder={`${platform} URL...`}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center pt-6 md:pt-10 pb-10">
        <button 
          onClick={onNext}
          className="group w-full sm:w-auto bg-indigo-600 text-white px-8 md:px-16 py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-sm shadow-2xl shadow-indigo-300 hover:bg-indigo-700 hover:shadow-indigo-500 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 active:scale-95 flex items-center justify-center gap-4"
        >
          GENERATE FULL PREVIEW <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default EditorForm;
