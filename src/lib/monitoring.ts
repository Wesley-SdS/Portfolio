import { Metric } from 'web-vitals';

// Track Web Vitals for performance monitoring
export const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals: any) => {
      // Use available metrics from the web-vitals library
      // Note: Function names may vary between versions
      try {
        if (webVitals.onCLS) webVitals.onCLS(onPerfEntry);
        if (webVitals.onINP) webVitals.onINP(onPerfEntry); // onINP replaces onFID in newer versions
        if (webVitals.onFCP) webVitals.onFCP(onPerfEntry);
        if (webVitals.onLCP) webVitals.onLCP(onPerfEntry);
        if (webVitals.onTTFB) webVitals.onTTFB(onPerfEntry);
      } catch (error) {
        console.warn('Web Vitals tracking setup failed:', error);
      }
    });
  }
};

// Performance thresholds for Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint (good: <2.5s)
  FID: 100,  // First Input Delay (good: <100ms)
  CLS: 0.1,  // Cumulative Layout Shift (good: <0.1)
  FCP: 1800, // First Contentful Paint (good: <1.8s)
  TTFB: 800, // Time to First Byte (good: <800ms)
};

// Check if performance metrics meet thresholds
export const checkPerformanceThresholds = (metric: Metric): boolean => {
  const threshold = PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS];
  return metric.value <= threshold;
};

// Log performance warnings
export const logPerformanceWarning = (metric: Metric) => {
  if (!checkPerformanceThresholds(metric)) {
    console.warn(`Performance warning: ${metric.name} (${metric.value}ms) exceeds threshold (${PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS]}ms)`);
    
    // Send to analytics for monitoring
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'performance_issue', {
        metric_name: metric.name,
        metric_value: metric.value,
        threshold: PERFORMANCE_THRESHOLDS[metric.name as keyof typeof PERFORMANCE_THRESHOLDS],
      });
    }
  }
};

// Enhanced Web Vitals reporting with analytics integration
export const reportWebVitalsWithAnalytics = () => {
  reportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vitals: ${metric.name}`, metric);
    }

    // Check thresholds and log warnings
    logPerformanceWarning(metric);

    // Send to Google Analytics
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  });
};

// Performance monitoring utilities
export const measurePageLoad = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // Track page load performance
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as any).gtag('event', 'page_load_time', {
          event_category: 'Performance',
          value: Math.round(loadTime),
        });
      }
    });
  }
};

// Resource timing monitoring
export const monitorResourceTiming = () => {
  if (typeof window !== 'undefined') {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    resources.forEach((resource) => {
      const duration = resource.duration;
      
      // Log slow resources (>2 seconds)
      if (duration > 2000) {
        console.warn(`Slow resource detected: ${resource.name} (${duration}ms)`);
        
        if (typeof window !== 'undefined' && 'gtag' in window) {
          (window as any).gtag('event', 'slow_resource', {
            event_category: 'Performance',
            event_label: resource.name,
            value: Math.round(duration),
          });
        }
      }
    });
  }
};