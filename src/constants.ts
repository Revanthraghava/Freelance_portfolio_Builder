
import { Category, Template } from './types';

export const CATEGORIES: Category[] = [
  'Web Developer',
  'UI/UX Designer',
  'Graphic Designer',
  'Video Editor',
  'Content Writer',
  'Photographer',
  'Animator',
  'Data Analyst',
  'Machine Learning Engineer',
  'AI Engineer',
  'WordPress Developer',
  'Mobile App Developer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Game Developer',
  'SEO Specialist',
  'Digital Marketer',
  'Social Media Manager',
  'Copywriter',
  'Cybersecurity Specialist'
];

export const TEMPLATES: Template[] = [
  {
    id: 'minimal-dev',
    name: 'Minimal Developer',
    description: 'A clean, typography-focused layout perfect for developers.',
    thumbnail: 'https://picsum.photos/seed/minimal/400/300'
  },
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Bold colors and dynamic layouts for visual artists.',
    thumbnail: 'https://picsum.photos/seed/creative/400/300'
  },
  {
    id: 'pro-freelancer',
    name: 'Professional Freelancer',
    description: 'Structured and trustworthy design for consultants.',
    thumbnail: 'https://picsum.photos/seed/pro/400/300'
  },
  {
    id: 'modern-dark',
    name: 'Dark Tech Portfolio',
    description: 'Sleek dark mode aesthetic for tech enthusiasts.',
    thumbnail: 'https://picsum.photos/seed/dark/400/300'
  }
];

export const INITIAL_DATA = {
  name: '',
  category: 'Web Developer' as Category,
  location: '',
  email: '',
  phone: '',
  bio: '',
  tagline: '',
  skills: [],
  projects: [],
  socials: {},
  templateId: 'minimal-dev'
};
