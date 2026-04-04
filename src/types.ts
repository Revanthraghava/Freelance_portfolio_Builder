
export type Category = 
  | 'Web Developer'
  | 'UI/UX Designer'
  | 'Graphic Designer'
  | 'Video Editor'
  | 'Content Writer'
  | 'Photographer'
  | 'Animator'
  | 'Data Analyst'
  | 'Machine Learning Engineer'
  | 'AI Engineer'
  | 'WordPress Developer'
  | 'Mobile App Developer'
  | 'DevOps Engineer'
  | 'Cloud Engineer'
  | 'Game Developer'
  | 'SEO Specialist'
  | 'Digital Marketer'
  | 'Social Media Manager'
  | 'Copywriter'
  | 'Cybersecurity Specialist';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
}

export interface PortfolioData {
  id?: string;
  userId?: string;
  name: string;
  category: Category;
  location: string;
  email: string;
  phone: string;
  bio: string;
  tagline: string;
  skills: Skill[];
  projects: Project[];
  socials: {
    github?: string;
    linkedin?: string;
    behance?: string;
    twitter?: string;
    instagram?: string;
  };
  templateId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Theme = 'minimal' | 'modern' | 'glass' | 'bold' | 'classic' | 'vibrant';

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}
