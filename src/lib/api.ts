import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Get auth token from Supabase
    const { data: { session } } = await supabase.auth.getSession()
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorData.message || 'An error occurred')
    }

    return response.json()
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string; staffCode?: string }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })
    
    if (error) throw error
    return data
  }

  async register(userData: {
    email: string
    password: string
    name: string
    role?: 'admin' | 'staff' | 'customer'
  }) {
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
    
    if (error) throw error
    return data
  }

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Product endpoints
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  async createProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Order endpoints
  async createOrder(order: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getOrders(userId?: string) {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  }

  // Generic CRUD operations
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()
