export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export const createValidationRules = (
  rules: Array<{
    type: 'required' | 'email' | 'phone' | 'url' | 'minLength' | 'maxLength';
    value?: number;
    message: string;
  }>
): ValidationRule[] => {
  return rules.map(rule => ({
    validate: (value: string) => {
      switch (rule.type) {
        case 'required':
          return validateRequired(value);
        case 'email':
          return validateEmail(value);
        case 'phone':
          return validatePhone(value);
        case 'url':
          return validateUrl(value);
        case 'minLength':
          return validateMinLength(value, rule.value || 0);
        case 'maxLength':
          return validateMaxLength(value, rule.value || Infinity);
        default:
          return true;
      }
    },
    message: rule.message
  }));
};

export const validateField = (value: string, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
};