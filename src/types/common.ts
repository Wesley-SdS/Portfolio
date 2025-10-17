export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    images: string[];
    type: 'website' | 'article' | 'profile';
  };
  twitter?: {
    card: 'summary' | 'summary_large_image';
    title: string;
    description: string;
    images: string[];
  };
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'instagram' | 'youtube';
  url: string;
  username?: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  timezone: string;
  availability: 'available' | 'busy' | 'unavailable';
}

export interface PersonalInfo {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  profileImage: string;
  resumeUrl?: string;
  contact: ContactInfo;
  socialLinks: SocialLink[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface Theme {
  name: 'light' | 'dark';
  colors: ThemeColors;
}

export interface Language {
  code: 'pt' | 'en' | 'es';
  name: string;
  flag: string;
}

export interface AppState {
  theme: Theme['name'];
  language: Language['code'];
  isLoading: boolean;
  error?: string;
}