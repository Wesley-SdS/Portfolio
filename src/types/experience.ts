export interface Technology {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai' | 'automation';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: number;
}

export interface Achievement {
  id: string;
  description: string;
  metrics?: string;
  impact?: string;
}

export interface Responsibility {
  id: string;
  description: string;
  category: 'technical' | 'leadership' | 'business' | 'strategic' | 'devops';
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  period: string;
  location: string;
  description: string;
  technologies: Technology[];
  achievements: Achievement[];
  responsibilities: Responsibility[];
  type: 'fulltime' | 'freelance' | 'contract' | 'internship';
  featured?: boolean;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years: number;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'ai' | 'automation';
}

export interface SkillsData {
  frontend: Skill[];
  backend: Skill[];
  database: Skill[];
  devops: Skill[];
  ai: Skill[];
  automation: Skill[];
  frameworks?: Skill[];
}