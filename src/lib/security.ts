// Security utilities for Zavolah Energy Hub

// XSS Prevention
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

// Content Security Policy
export const setupCSP = () => {
  const meta = document.createElement('meta')
  meta.httpEquiv = 'Content-Security-Policy'
  meta.content = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://js.paystack.co",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.paystack.co https://*.supabase.co",
    "frame-src 'self' https://js.paystack.co"
  ].join('; ')
  
  document.head.appendChild(meta)
}

// Domain Verification
export const verifyDomain = (): boolean => {
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'zavolah.com',
    'www.zavolah.com',
    'zavolah.vercel.app', // For Vercel deployment
    'zavolah.netlify.app' // For Netlify deployment
  ]
  
  const currentDomain = window.location.hostname
  return allowedDomains.some(domain => currentDomain.includes(domain))
}

// Password Strength Validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0
  
  if (password.length >= 8) score += 1
  else feedback.push('Password must be at least 8 characters long')
  
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Password must contain at least one lowercase letter')
  
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Password must contain at least one uppercase letter')
  
  if (/\d/.test(password)) score += 1
  else feedback.push('Password must contain at least one number')
  
  if (/[@$!%*?&]/.test(password)) score += 1
  else feedback.push('Password must contain at least one special character (@$!%*?&)')
  
  return {
    isValid: score === 5,
    score,
    feedback
  }
}

// Rate Limiting (Client-side basic implementation)
class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly maxRequests: number
  private readonly windowMs: number
  
  constructor(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    return true
  }
  
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }
}

export const rateLimiter = new RateLimiter()

// Session Security
export const generateSessionId = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// CSRF Token Generation
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
}

// Input Validation Schemas
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phoneRegex = /^(\+234|0)[789]\d{9}$/
export const staffCodeRegex = /^[a-zA-Z0-9@£\-]+$/

// Security Headers Check
export const checkSecurityHeaders = (): {
  hasHTTPS: boolean
  hasCSP: boolean
  hasXFrameOptions: boolean
} => {
  return {
    hasHTTPS: window.location.protocol === 'https:',
    hasCSP: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
    hasXFrameOptions: !!document.querySelector('meta[http-equiv="X-Frame-Options"]')
  }
}

// Encryption/Decryption utilities (for sensitive data)
export const encryptSensitiveData = async (data: string, key?: string): Promise<string> => {
  // Basic encryption - in production, use a proper encryption library
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key || 'zavolah-default-key'),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )
  
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  )
  
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    derivedKey,
    encoder.encode(data)
  )
  
  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength)
  result.set(salt, 0)
  result.set(iv, salt.length)
  result.set(new Uint8Array(encrypted), salt.length + iv.length)
  
  return btoa(String.fromCharCode(...result))
}

// Security event logging
export const logSecurityEvent = (event: string, details: Record<string, any> = {}) => {
  const securityLog = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href,
    sessionId: sessionStorage.getItem('sessionId') || 'anonymous'
  }
  
  // In production, send to security monitoring service
  console.warn('Security Event:', securityLog)
  
  // Store locally for debugging
  const logs = JSON.parse(localStorage.getItem('security-logs') || '[]')
  logs.push(securityLog)
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.splice(0, logs.length - 100)
  }
  
  localStorage.setItem('security-logs', JSON.stringify(logs))
}

// Initialize security on app start
export const initializeSecurity = () => {
  // Verify domain
  if (!verifyDomain()) {
    logSecurityEvent('INVALID_DOMAIN', { domain: window.location.hostname })
    throw new Error('Unauthorized domain')
  }
  
  // Setup CSP
  setupCSP()
  
  // Generate session ID
  if (!sessionStorage.getItem('sessionId')) {
    sessionStorage.setItem('sessionId', generateSessionId())
  }
  
  // Check security headers
  const securityCheck = checkSecurityHeaders()
  if (!securityCheck.hasHTTPS && window.location.hostname !== 'localhost') {
    logSecurityEvent('INSECURE_CONNECTION', securityCheck)
  }
  
  logSecurityEvent('SECURITY_INITIALIZED', { checks: securityCheck })
}

export default {
  sanitizeInput,
  setupCSP,
  verifyDomain,
  validatePasswordStrength,
  rateLimiter,
  generateSessionId,
  generateCSRFToken,
  checkSecurityHeaders,
  encryptSensitiveData,
  logSecurityEvent,
  initializeSecurity
}
