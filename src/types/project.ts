export interface ProjectLink {
  type: 'github' | 'live' | 'demo' | 'documentation';
  url: string;
  label: string;
}

export interface ProjectImage {
  src: string;
  alt: string;
  type: 'cover' | 'screenshot' | 'demo';
}

export interface ProjectMetrics {
  users?: string;
  uptime?: string;
  performance?: string;
  integrations?: number;
  accuracy?: string;
  conversion?: string;
  reduction?: string;
  increase?: string;
  stores?: string;
  orders?: string;
  banks?: string;
  products?: string;
  languages?: string;
  processing?: string;
  scalability?: string;
  development?: string;
  modules?: string;
  integration?: string;
  features?: string;
  customMetric?: {
    label: string;
    value: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  images: ProjectImage[];
  technologies: string[];
  links: ProjectLink[];
  featured: boolean;
  category: 'platform' | 'ai-platform' | 'ecommerce' | 'dashboard' | 'landing' | 'mobile' | 'saas';
  status: 'completed' | 'in-progress' | 'planned' | 'maintenance';
  achievements: string[];
  metrics?: ProjectMetrics;
  startDate: string;
  endDate?: string;
  teamSize?: number;
  role: string;
}

export interface ProjectFilter {
  category?: Project['category'];
  technology?: string;
  featured?: boolean;
  status?: Project['status'];
}