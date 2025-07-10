// Two-Factor Authentication Service for Zavolah Energy Hub

import { emailService } from './emailService'

interface TwoFactorSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

interface TwoFactorVerification {
  isValid: boolean
  attemptsRemaining: number
  isLocked: boolean
}

class TwoFactorAuthService {
  private readonly codeLength = 6
  private readonly codeExpiryMinutes = 5
  private readonly maxAttempts = 3
  private readonly lockoutMinutes = 15

  // Generate a random 6-digit code
  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Generate TOTP secret (for authenticator apps)
  generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let secret = ''
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return secret
  }

  // Generate backup codes
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      codes.push(this.generateCode() + this.generateCode())
    }
    return codes
  }

  // Setup 2FA for a user
  async setup2FA(userId: string): Promise<TwoFactorSetup> {
    const secret = this.generateSecret()
    const backupCodes = this.generateBackupCodes()
    
    // Generate QR code URL for authenticator apps
    const issuer = 'Zavolah Energy Hub'
    const accountName = `${userId}@zavolah.com`
    const qrCodeUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`
    
    // In production, save to database
    const setup = {
      secret,
      qrCode: qrCodeUrl,
      backupCodes,
      enabled: false,
      setupDate: new Date().toISOString()
    }

    // Store in localStorage for development
    localStorage.setItem(`2fa_setup_${userId}`, JSON.stringify(setup))

    return {
      secret,
      qrCode: qrCodeUrl,
      backupCodes
    }
  }

  // Send 2FA code via email
  async sendEmailCode(userId: string, email: string): Promise<boolean> {
    const code = this.generateCode()
    const expiryTime = new Date(Date.now() + this.codeExpiryMinutes * 60 * 1000)

    // Store code with expiry
    const codeData = {
      code,
      expiryTime: expiryTime.toISOString(),
      attempts: 0,
      email
    }

    localStorage.setItem(`2fa_email_${userId}`, JSON.stringify(codeData))

    // Send email
    return await emailService.send2FACode(email, code)
  }

  // Send 2FA code via SMS (mock implementation)
  async sendSMSCode(userId: string, phoneNumber: string): Promise<boolean> {
    const code = this.generateCode()
    const expiryTime = new Date(Date.now() + this.codeExpiryMinutes * 60 * 1000)

    // Store code with expiry
    const codeData = {
      code,
      expiryTime: expiryTime.toISOString(),
      attempts: 0,
      phoneNumber
    }

    localStorage.setItem(`2fa_sms_${userId}`, JSON.stringify(codeData))

    // Mock SMS sending
    console.log(`📱 SMS Code for ${phoneNumber}: ${code}`)
    
    return true
  }

  // Verify email/SMS code
  verifyEmailCode(userId: string, code: string): TwoFactorVerification {
    const storedData = localStorage.getItem(`2fa_email_${userId}`)
    
    if (!storedData) {
      return { isValid: false, attemptsRemaining: 0, isLocked: false }
    }

    const codeData = JSON.parse(storedData)
    const now = new Date()
    const expiryTime = new Date(codeData.expiryTime)

    // Check if code expired
    if (now > expiryTime) {
      localStorage.removeItem(`2fa_email_${userId}`)
      return { isValid: false, attemptsRemaining: 0, isLocked: false }
    }

    // Check attempts
    codeData.attempts = (codeData.attempts || 0) + 1

    if (codeData.attempts > this.maxAttempts) {
      // Lock the user
      const lockUntil = new Date(now.getTime() + this.lockoutMinutes * 60 * 1000)
      localStorage.setItem(`2fa_locked_${userId}`, lockUntil.toISOString())
      localStorage.removeItem(`2fa_email_${userId}`)
      return { isValid: false, attemptsRemaining: 0, isLocked: true }
    }

    // Update attempts
    localStorage.setItem(`2fa_email_${userId}`, JSON.stringify(codeData))

    // Verify code
    const isValid = codeData.code === code

    if (isValid) {
      localStorage.removeItem(`2fa_email_${userId}`)
    }

    return {
      isValid,
      attemptsRemaining: this.maxAttempts - codeData.attempts,
      isLocked: false
    }
  }

  // Verify TOTP code (from authenticator app)
  verifyTOTPCode(userId: string, code: string): boolean {
    // This would use a proper TOTP library in production
    // For demo purposes, accept any 6-digit code
    return /^\d{6}$/.test(code)
  }

  // Verify backup code
  verifyBackupCode(userId: string, code: string): boolean {
    const setupData = localStorage.getItem(`2fa_setup_${userId}`)
    
    if (!setupData) {
      return false
    }

    const setup = JSON.parse(setupData)
    const codeIndex = setup.backupCodes.indexOf(code)

    if (codeIndex === -1) {
      return false
    }

    // Remove used backup code
    setup.backupCodes.splice(codeIndex, 1)
    localStorage.setItem(`2fa_setup_${userId}`, JSON.stringify(setup))

    return true
  }

  // Check if user is locked out
  isUserLocked(userId: string): boolean {
    const lockUntil = localStorage.getItem(`2fa_locked_${userId}`)
    
    if (!lockUntil) {
      return false
    }

    const lockTime = new Date(lockUntil)
    const now = new Date()

    if (now > lockTime) {
      localStorage.removeItem(`2fa_locked_${userId}`)
      return false
    }

    return true
  }

  // Enable 2FA for user
  async enable2FA(userId: string, verificationCode: string): Promise<boolean> {
    // Verify the setup code first
    if (!this.verifyTOTPCode(userId, verificationCode)) {
      return false
    }

    const setupData = localStorage.getItem(`2fa_setup_${userId}`)
    if (!setupData) {
      return false
    }

    const setup = JSON.parse(setupData)
    setup.enabled = true
    setup.enabledDate = new Date().toISOString()

    localStorage.setItem(`2fa_setup_${userId}`, JSON.stringify(setup))
    return true
  }

  // Disable 2FA for user
  async disable2FA(userId: string, password: string): Promise<boolean> {
    // In production, verify password first
    localStorage.removeItem(`2fa_setup_${userId}`)
    localStorage.removeItem(`2fa_email_${userId}`)
    localStorage.removeItem(`2fa_sms_${userId}`)
    localStorage.removeItem(`2fa_locked_${userId}`)
    
    return true
  }

  // Check if 2FA is enabled for user
  is2FAEnabled(userId: string): boolean {
    const setupData = localStorage.getItem(`2fa_setup_${userId}`)
    
    if (!setupData) {
      return false
    }

    const setup = JSON.parse(setupData)
    return setup.enabled === true
  }

  // Get 2FA status for user
  get2FAStatus(userId: string): {
    enabled: boolean
    methods: string[]
    backupCodesRemaining: number
    isLocked: boolean
    lockUntil?: string
  } {
    const setupData = localStorage.getItem(`2fa_setup_${userId}`)
    const isLocked = this.isUserLocked(userId)
    const lockUntil = localStorage.getItem(`2fa_locked_${userId}`)

    if (!setupData) {
      return {
        enabled: false,
        methods: [],
        backupCodesRemaining: 0,
        isLocked,
        lockUntil: lockUntil || undefined
      }
    }

    const setup = JSON.parse(setupData)
    const methods = ['authenticator']
    
    return {
      enabled: setup.enabled === true,
      methods,
      backupCodesRemaining: setup.backupCodes.length,
      isLocked,
      lockUntil: lockUntil || undefined
    }
  }
}

export const twoFactorAuthService = new TwoFactorAuthService()
export default twoFactorAuthService
