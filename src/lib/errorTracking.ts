// lib/errorTracking.ts
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  timestamp?: number;
  userAgent?: string;
  url?: string;
  [key: string]: any;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  name?: string;
  context?: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Global error handler setup
export const setupGlobalErrorHandling = () => {
  if (typeof window !== 'undefined') {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      trackError(
        new Error(event.reason),
        {
          component: 'Global',
          action: 'unhandledRejection',
          severity: 'high',
        }
      );
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      trackError(
        event.error || new Error(event.message),
        {
          component: 'Global',
          action: 'javascriptError',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          severity: 'medium',
        }
      );
    });
  }
};

// Enhanced error tracking with context
export const trackError = (error: Error, context?: Partial<ErrorContext>) => {
  const errorContext: ErrorContext = {
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    sessionId: getSessionId(),
    ...context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', error, errorContext);
  }

  // Create error report
  const errorReport: ErrorReport = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    context: errorContext,
    severity: determineSeverity(error, context),
  };

  // Send to analytics
  sendErrorToAnalytics(errorReport);

  // Send to Sentry if available
  sendToSentry(error, errorContext);
};

// Determine error severity
const determineSeverity = (error: Error, context?: Partial<ErrorContext>): ErrorReport['severity'] => {
  // Network errors are high severity
  if (error.message.includes('Network') || error.message.includes('fetch')) {
    return 'high';
  }

  // Authentication errors are critical
  if (error.message.includes('Unauthorized') || error.message.includes('Authentication')) {
    return 'critical';
  }

  // Validation errors are low severity
  if (error.message.includes('Validation') || error.name === 'ValidationError') {
    return 'low';
  }

  // Component errors are medium severity
  if (context?.component) {
    return 'medium';
  }

  // Default to medium
  return 'medium';
};

// Send error to Google Analytics
const sendErrorToAnalytics = (errorReport: ErrorReport) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', 'exception', {
      description: errorReport.message,
      fatal: errorReport.severity === 'critical',
      custom_map: {
        error_name: errorReport.name,
        error_component: errorReport.context?.component,
        error_action: errorReport.context?.action,
        error_severity: errorReport.severity,
      },
    });
  }
};

// Send to Sentry if available
const sendToSentry = (error: Error, context: ErrorContext) => {
  if (typeof window !== 'undefined' && 'Sentry' in window) {
    (window as any).Sentry.captureException(error, {
      contexts: { custom: context },
      tags: {
        component: context.component,
        action: context.action,
        severity: context.severity,
      },
    });
  }
};

// Get or create session ID
const getSessionId = (): string => {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('error_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('error_session_id', sessionId);
    }
    return sessionId;
  }
  return 'server_session';
};

// Component-specific error tracking
export const trackComponentError = (componentName: string, error: Error, action?: string) => {
  trackError(error, {
    component: componentName,
    action,
    severity: 'medium',
  });
};

// API error tracking
export const trackApiError = (endpoint: string, error: Error, statusCode?: number) => {
  const severity = statusCode && statusCode >= 500 ? 'critical' : 'high';
  
  trackError(error, {
    component: 'API',
    action: `api_call_${endpoint}`,
    endpoint,
    statusCode,
    severity,
  });
};

// Form submission error tracking
export const trackFormError = (formName: string, error: Error, formData?: any) => {
  trackError(error, {
    component: 'Form',
    action: `form_submit_${formName}`,
    formName,
    formData: formData ? { ...formData, sensitive: 'REDACTED' } : undefined,
    severity: 'medium',
  });
};

// Performance error tracking
export const trackPerformanceError = (metricName: string, value: number, threshold: number) => {
  const error = new Error(`Performance threshold exceeded: ${metricName} = ${value}ms (threshold: ${threshold}ms)`);
  
  trackError(error, {
    component: 'Performance',
    action: 'threshold_exceeded',
    metricName,
    value,
    threshold,
    severity: 'medium',
  });
};

// User interaction error tracking
export const trackUserInteractionError = (action: string, error: Error, element?: string) => {
  trackError(error, {
    component: 'UserInteraction',
    action,
    element,
    severity: 'low',
  });
};