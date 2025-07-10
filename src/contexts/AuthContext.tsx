import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useToast } from '@/components/ui/use-toast'

// Types
interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff' | 'customer'
  avatar?: string
  staffCode?: string
  department?: string
  points?: number
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
}

interface LoginCredentials {
  email: string
  password: string
  staffCode?: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  staffCode?: string
  role?: 'staff' | 'customer'
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const isAuthenticated = !!user

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await updateUserFromSession(session.user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await updateUserFromSession(session.user)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserFromSession = async (supabaseUser: SupabaseUser) => {
    try {
      // Get user profile from database
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      const userData: User = {
        id: supabaseUser.id,
        name: profile?.name || supabaseUser.user_metadata?.name || 'Unknown',
        email: supabaseUser.email || '',
        role: profile?.role || 'customer',
        avatar: profile?.avatar || supabaseUser.user_metadata?.avatar_url,
        staffCode: profile?.staff_code,
        department: profile?.department,
        points: profile?.points || 0,
        createdAt: profile?.created_at || new Date().toISOString(),
        updatedAt: profile?.updated_at || new Date().toISOString()
      }

      setUser(userData)
    } catch (error) {
      console.error('Error updating user from session:', error)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        await updateUserFromSession(data.user)
      }

      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      })
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'customer',
          },
        },
      })

      if (error) {
        throw error
      }

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role || 'customer',
            staff_code: userData.staffCode,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
      }

      toast({
        title: "Registration Successful",
        description: `Welcome to Zavolah, ${userData.name}!`,
      })
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive"
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return

      const { error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          avatar: userData.avatar,
          department: userData.department,
          staff_code: userData.staffCode,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        throw error
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...userData } : null)
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
  }

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export type { User, LoginCredentials, RegisterData }
