import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'staff' | 'customer'
          avatar?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'staff' | 'customer'
          avatar?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'staff' | 'customer'
          avatar?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category: string
          image: string
          in_stock: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category: string
          image: string
          in_stock?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category?: string
          image?: string
          in_stock?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          payment_method: string
          shipping_address: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          payment_method: string
          shipping_address: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total?: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered'
          payment_method?: string
          shipping_address?: any
          created_at?: string
          updated_at?: string
        }
      }
      // Add more table types as needed
    }
  }
}
