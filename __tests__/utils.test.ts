import { describe, it, expect } from '@jest/globals';
import { formatDate, validateEmail, validatePhone } from '../src/utils';

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe('string');
    });
  });
});

describe('validation', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com',
        'test@.com',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validatePhone', () => {
    it('should validate Brazilian phone numbers', () => {
      const validPhones = [
        '+55 11 99999-9999',
        '(11) 99999-9999',
        '11999999999',
        '55 11 99999-9999'
      ];

      validPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(true);
      });
    });

    it('should reject obviously invalid phone numbers', () => {
      const invalidPhones = [
        'abc',
        '',
        '123'
      ];

      invalidPhones.forEach(phone => {
        expect(validatePhone(phone)).toBe(false);
      });
    });
  });
});