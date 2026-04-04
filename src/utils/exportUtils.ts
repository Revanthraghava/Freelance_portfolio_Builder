
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PortfolioData } from '../types';

export const exportPortfolio = async (data: PortfolioData) => {
  const zip = new JSZip();

  const getTemplateStyles = (templateId: string) => {
    switch (templateId) {
      case 'modern-dark':
        return 'bg-slate-950 text-white';
      case 'creative-designer':
        return 'bg-[#0a0a0a] text-white';
      case 'pro-freelancer':
        return 'bg-slate-50 text-slate-900';
      default:
        return 'bg-white text-slate-900';
    }
  };

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} | ${data.category}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; }
        .tracking-tighter { letter-spacing: -0.05em; }
    </style>
</head>
<body class="${getTemplateStyles(data.templateId)}">
    <div id="root">
        <!-- Navigation -->
        <nav class="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center border-b border-white/5">
            <span class="text-xl font-black tracking-tighter">${data.name}</span>
            <div class="flex gap-8 text-[10px] font-black uppercase tracking-widest opacity-50">
                <a href="#about" class="hover:opacity-100 transition-opacity">About</a>
                <a href="#projects" class="hover:opacity-100 transition-opacity">Projects</a>
                <a href="#contact" class="hover:opacity-100 transition-opacity">Contact</a>
            </div>
        </nav>

        <!-- Hero -->
        <section class="max-w-7xl mx-auto px-6 py-32 md:py-48">
            <div class="max-w-4xl">
                <h1 class="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight italic">
                    ${data.tagline || `I'm a ${data.category}.`}
                </h1>
                <p class="text-xl md:text-2xl opacity-60 font-medium leading-relaxed mb-12">
                    ${data.bio}
                </p>
                <div class="flex gap-4">
                    ${data.socials.github ? `<a href="${data.socials.github}" class="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs">GitHub</a>` : ''}
                    ${data.socials.linkedin ? `<a href="${data.socials.linkedin}" class="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs">LinkedIn</a>` : ''}
                </div>
            </div>
        </section>

        <!-- Skills -->
        <section id="about" class="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
            <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-20">Expertise</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
                ${data.skills.map(skill => `
                    <div class="space-y-4">
                        <div class="flex justify-between items-end">
                            <span class="font-black text-lg italic">${skill.name}</span>
                            <span class="text-[10px] font-bold opacity-40">${skill.level}%</span>
                        </div>
                        <div class="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-indigo-500" style="width: ${skill.level}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Projects -->
        <section id="projects" class="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
            <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-20">Selected Projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                ${data.projects.map(project => `
                    <div class="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
                        <div class="aspect-video">
                            <img src="${project.image}" alt="" class="w-full h-full object-cover" />
                        </div>
                        <div class="p-10">
                            <h3 class="text-2xl font-black mb-4">${project.title}</h3>
                            <p class="opacity-60 font-medium mb-8">${project.description}</p>
                            <a href="${project.link}" class="text-indigo-500 font-black uppercase tracking-widest text-[10px]">View Project →</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- Contact -->
        <footer id="contact" class="py-32 border-t border-white/5 text-center">
            <h2 class="text-5xl font-black tracking-tighter mb-8 italic">Let's connect.</h2>
            <a href="mailto:${data.email}" class="text-2xl md:text-4xl font-black text-indigo-500 underline underline-offset-8">${data.email}</a>
            <p class="mt-20 text-[10px] font-black uppercase tracking-widest opacity-30">© ${new Date().getFullYear()} ${data.name}</p>
        </footer>
    </div>
</body>
</html>
  `;

  zip.file("index.html", html);
  
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${data.name.replace(/\s+/g, '_')}_portfolio.zip`);
};
