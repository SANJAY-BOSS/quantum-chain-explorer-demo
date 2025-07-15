import DOMPurify from 'dompurify';

/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

// Sanitize HTML content
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title']
  });
};

// Sanitize text input
export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

// Validate and sanitize JSON
export const sanitizeJson = (jsonString: string): any => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Remove any potentially dangerous functions or objects
    const sanitized = JSON.parse(JSON.stringify(parsed, (key, value) => {
      if (typeof value === 'function') return undefined;
      if (typeof value === 'string') return sanitizeText(value);
      return value;
    }));
    
    return sanitized;
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate input length
export const validateLength = (input: string, min: number, max: number): boolean => {
  return input.length >= min && input.length <= max;
};

// Sanitize blockchain data
export const sanitizeBlockchainData = (data: any): any => {
  if (typeof data === 'string') {
    return sanitizeText(data);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = sanitizeText(key);
      sanitized[sanitizedKey] = sanitizeBlockchainData(value);
    }
    return sanitized;
  }
  
  return data;
};

// Rate limiting helper
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, number[]>();
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    return true;
  };
};