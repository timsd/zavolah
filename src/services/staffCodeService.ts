import { api } from '@/lib/api'

export interface StaffCode {
  id: string
  code: string
  department: string
  position: string
  createdBy: string
  createdAt: string
  expiresAt: string
  usedAt?: string
  usedBy?: string
  isActive: boolean
  maxUses: number
  usageCount: number
}

export interface StaffCodeValidation {
  isValid: boolean
  code?: StaffCode
  message: string
}

export interface CreateStaffCodeRequest {
  department: string
  position: string
  expirationDays: number
  maxUses: number
}

class StaffCodeService {
  private generateUniqueCode(): string {
    // Generate a complex staff code following the pattern: da70t93@6£LZ0h
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@£'
    const specialPattern = ['da', '70', 't', '93', '@', '6', '£', 'LZ', '0', 'h']
    
    // Create variations of the base pattern
    const variations = [
      'da70t93@6£LZ0h',
      'db71u94@7£MZ1i',
      'dc72v95@8£NZ2j',
      'dd73w96@9£OZ3k',
      'de74x97@0£PZ4l',
    ]
    
    const baseCode = variations[Math.floor(Math.random() * variations.length)]
    const randomSuffix = Math.random().toString(36).substring(2, 6)
    
    return `${baseCode}-${randomSuffix}`
  }

  async validateStaffCode(code: string): Promise<StaffCodeValidation> {
    try {
      const response = await api.post<StaffCodeValidation>('/staff/validate-code', { code })
      return response
    } catch (error: any) {
      // Mock validation for development
      const mockValidCodes = [
        'da70t93@6£LZ0h',
        'dh-zav-4-o-20-lah-93',
        'db71u94@7£MZ1i-abc1',
        'dc72v95@8£NZ2j-def2',
        'dd73w96@9£OZ3k-ghi3'
      ]

      if (mockValidCodes.includes(code)) {
        return {
          isValid: true,
          code: {
            id: 'mock-id',
            code,
            department: 'General',
            position: 'Staff',
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            maxUses: 1,
            usageCount: 0
          },
          message: 'Staff code is valid'
        }
      }

      return {
        isValid: false,
        message: 'Invalid staff code. Please contact your administrator for a valid code.'
      }
    }
  }

  async createStaffCode(request: CreateStaffCodeRequest): Promise<StaffCode> {
    try {
      const response = await api.post<StaffCode>('/staff/create-code', request)
      return response
    } catch (error: any) {
      // Mock creation for development
      const mockCode: StaffCode = {
        id: `code-${Date.now()}`,
        code: this.generateUniqueCode(),
        department: request.department,
        position: request.position,
        createdBy: 'current-admin',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + request.expirationDays * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        maxUses: request.maxUses,
        usageCount: 0
      }

      // Store in localStorage for development
      const existingCodes = JSON.parse(localStorage.getItem('staff-codes') || '[]')
      existingCodes.push(mockCode)
      localStorage.setItem('staff-codes', JSON.stringify(existingCodes))

      return mockCode
    }
  }

  async getAllStaffCodes(): Promise<StaffCode[]> {
    try {
      const response = await api.get<{ codes: StaffCode[] }>('/staff/codes')
      return response.codes
    } catch (error: any) {
      // Mock data for development
      const savedCodes = JSON.parse(localStorage.getItem('staff-codes') || '[]')
      const defaultCodes: StaffCode[] = [
        {
          id: 'default-1',
          code: 'da70t93@6£LZ0h',
          department: 'Administration',
          position: 'Manager',
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          expiresAt: '2024-12-31T23:59:59Z',
          isActive: true,
          maxUses: 5,
          usageCount: 2
        },
        {
          id: 'default-2',
          code: 'dh-zav-4-o-20-lah-93',
          department: 'Operations',
          position: 'Staff',
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          expiresAt: '2024-06-30T23:59:59Z',
          isActive: true,
          maxUses: 1,
          usageCount: 0
        }
      ]

      return [...defaultCodes, ...savedCodes]
    }
  }

  async deactivateStaffCode(codeId: string): Promise<boolean> {
    try {
      await api.patch(`/staff/codes/${codeId}/deactivate`)
      return true
    } catch (error: any) {
      // Mock deactivation for development
      const savedCodes = JSON.parse(localStorage.getItem('staff-codes') || '[]')
      const updatedCodes = savedCodes.map((code: StaffCode) => 
        code.id === codeId ? { ...code, isActive: false } : code
      )
      localStorage.setItem('staff-codes', JSON.stringify(updatedCodes))
      return true
    }
  }

  async extendStaffCode(codeId: string, additionalDays: number): Promise<boolean> {
    try {
      await api.patch(`/staff/codes/${codeId}/extend`, { additionalDays })
      return true
    } catch (error: any) {
      // Mock extension for development
      const savedCodes = JSON.parse(localStorage.getItem('staff-codes') || '[]')
      const updatedCodes = savedCodes.map((code: StaffCode) => {
        if (code.id === codeId) {
          const newExpirationDate = new Date(code.expiresAt)
          newExpirationDate.setDate(newExpirationDate.getDate() + additionalDays)
          return { ...code, expiresAt: newExpirationDate.toISOString() }
        }
        return code
      })
      localStorage.setItem('staff-codes', JSON.stringify(updatedCodes))
      return true
    }
  }

  async markCodeAsUsed(code: string, userId: string): Promise<boolean> {
    try {
      await api.patch('/staff/codes/mark-used', { code, userId })
      return true
    } catch (error: any) {
      // Mock usage tracking for development
      const savedCodes = JSON.parse(localStorage.getItem('staff-codes') || '[]')
      const updatedCodes = savedCodes.map((staffCode: StaffCode) => {
        if (staffCode.code === code) {
          return {
            ...staffCode,
            usageCount: staffCode.usageCount + 1,
            usedAt: new Date().toISOString(),
            usedBy: userId,
            isActive: staffCode.usageCount + 1 >= staffCode.maxUses ? false : staffCode.isActive
          }
        }
        return staffCode
      })
      localStorage.setItem('staff-codes', JSON.stringify(updatedCodes))
      return true
    }
  }

  isCodeExpired(code: StaffCode): boolean {
    return new Date(code.expiresAt) < new Date()
  }

  isCodeExhausted(code: StaffCode): boolean {
    return code.usageCount >= code.maxUses
  }

  getCodeStatus(code: StaffCode): 'active' | 'expired' | 'exhausted' | 'inactive' {
    if (!code.isActive) return 'inactive'
    if (this.isCodeExpired(code)) return 'expired'
    if (this.isCodeExhausted(code)) return 'exhausted'
    return 'active'
  }
}

export const staffCodeService = new StaffCodeService()
export default staffCodeService
