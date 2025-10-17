// lib/analytics.ts
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', eventName, properties);
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

export const trackCustomEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track project clicks
export const trackProjectClick = (projectTitle: string, projectUrl: string) => {
  trackCustomEvent('project_click', 'Engagement', projectTitle);
  trackEvent('project_viewed', { project: projectTitle, url: projectUrl });
};

// Track contact form submissions
export const trackContactSubmission = () => {
  trackCustomEvent('contact_form_submit', 'Conversion');
  trackEvent('lead_generated');
};

// Track skill interactions
export const trackSkillView = (skillName: string, category: string) => {
  trackCustomEvent('skill_view', 'Engagement', skillName);
  trackEvent('skill_interaction', { skill: skillName, category });
};

// Track theme changes
export const trackThemeChange = (theme: string) => {
  trackCustomEvent('theme_change', 'User Preference', theme);
  trackEvent('preference_updated', { type: 'theme', value: theme });
};

// Track language changes
export const trackLanguageChange = (language: string) => {
  trackCustomEvent('language_change', 'User Preference', language);
  trackEvent('preference_updated', { type: 'language', value: language });
};