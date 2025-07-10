import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminSettings {
  // Footer visibility settings
  showZavCharge: boolean
  showReferEarn: boolean
  showMarketplace: boolean
  showStaffAccess: boolean
  
  // ZavCharge product settings
  zavChargeEnabled: boolean
  zavChargeTitle: string
  zavChargeDescription: string
  
  // Refer & Earn settings
  referEarnEnabled: boolean
  maxCommission: number
  minReferrals: number
  referralTerms: string
  
  // Homepage settings
  heroTitle: string
  heroSubtitle: string
}

interface AdminSettingsContextType {
  settings: AdminSettings
  updateSettings: (newSettings: Partial<AdminSettings>) => void
  resetSettings: () => void
}

const defaultSettings: AdminSettings = {
  // Footer visibility settings
  showZavCharge: true,
  showReferEarn: true,
  showMarketplace: true,
  showStaffAccess: true,
  
  // ZavCharge product settings
  zavChargeEnabled: true,
  zavChargeTitle: "ZavCharge - Solar EV Charging Network",
  zavChargeDescription: "Nigeria's first solar-powered electric vehicle charging network bringing clean, reliable, and affordable charging solutions.",
  
  // Refer & Earn settings
  referEarnEnabled: true,
  maxCommission: 15,
  minReferrals: 1,
  referralTerms: "By joining the Zavolah Refer & Earn program, you agree to promote our products ethically and in compliance with all applicable laws.",
  
  // Homepage settings
  heroTitle: "What makes a home?",
  heroSubtitle: "Good design, structure, functional smart furniture, and self-owned 24/7 power supply"
}

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined)

export const useAdminSettings = () => {
  const context = useContext(AdminSettingsContext)
  if (context === undefined) {
    throw new Error('useAdminSettings must be used within an AdminSettingsProvider')
  }
  return context
}

interface AdminSettingsProviderProps {
  children: React.ReactNode
}

export const AdminSettingsProvider: React.FC<AdminSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('zavolah-admin-settings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsedSettings })
      } catch (error) {
        console.error('Error parsing saved admin settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('zavolah-admin-settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('zavolah-admin-settings')
  }

  const value: AdminSettingsContextType = {
    settings,
    updateSettings,
    resetSettings
  }

  return (
    <AdminSettingsContext.Provider value={value}>
      {children}
    </AdminSettingsContext.Provider>
  )
}

export default AdminSettingsContext
