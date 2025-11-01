/**
 * Input validation utilities for production
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Sanitize string input to prevent XSS
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') {
    throw new ValidationError('Input must be a string');
  }
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate ID (positive integer)
 */
export const isValidId = (id: any): boolean => {
  const numId = Number(id);
  return Number.isInteger(numId) && numId > 0;
};

/**
 * Validate array of IDs
 */
export const isValidIdArray = (ids: any): boolean => {
  if (!Array.isArray(ids)) return false;
  return ids.every(id => isValidId(id));
};

/**
 * Validate pagination parameters
 */
export const validatePaginationParams = (page: any, pageSize: any, maxPageSize = 100) => {
  const validPage = Math.max(1, parseInt(page as string) || 1);
  const validPageSize = Math.min(maxPageSize, Math.max(1, parseInt(pageSize as string) || 25));
  
  if (isNaN(validPage) || isNaN(validPageSize)) {
    throw new ValidationError('Invalid pagination parameters');
  }
  
  return { page: validPage, pageSize: validPageSize };
};

/**
 * Validate message content
 */
export const validateMessage = (message: string, maxLength = 2000): string => {
  if (!message || typeof message !== 'string') {
    throw new ValidationError('Message must be a non-empty string');
  }
  
  const sanitized = sanitizeString(message);
  
  if (sanitized.length === 0) {
    throw new ValidationError('Message cannot be empty');
  }
  
  if (sanitized.length > maxLength) {
    throw new ValidationError(`Message cannot exceed ${maxLength} characters`);
  }
  
  return sanitized;
};

/**
 * Validate enum value
 */
export const validateEnum = (value: string, allowedValues: string[], fieldName = 'Value'): void => {
  if (!allowedValues.includes(value)) {
    throw new ValidationError(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file: any, maxSizeMB = 10): void => {
  if (!file) {
    throw new ValidationError('File is required');
  }
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new ValidationError(`File size cannot exceed ${maxSizeMB}MB`);
  }
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
