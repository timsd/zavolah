// Custom hooks for API interactions

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'

// Generic API hook for GET requests
export function useApi<T>(endpoint: string, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get<T>(endpoint)
        setData(response)
      } catch (err: any) {
        setError(err.message)
        toast({
          title: "Error",
          description: err.message || "Failed to fetch data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: () => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get<T>(endpoint)
        setData(response)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }}
}

// Hook for POST requests
export function usePost<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const post = async (endpoint: string, data: any): Promise<T> => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.post<T>(endpoint, data)
      return response
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message || "Operation failed",
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { post, loading, error }
}

// Hook for PUT requests
export function usePut<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const put = async (endpoint: string, data: any): Promise<T> => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.put<T>(endpoint, data)
      return response
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message || "Update failed",
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { put, loading, error }
}

// Hook for DELETE requests
export function useDelete<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const deleteItem = async (endpoint: string): Promise<T> => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.delete<T>(endpoint)
      return response
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message || "Delete failed",
        variant: "destructive"
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteItem, loading, error }
}

// Hook for file uploads
export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const uploadFile = async (endpoint: string, file: File, additionalData?: Record<string, string>) => {
    try {
      setUploading(true)
      setError(null)
      setUploadProgress(0)
      
      // Simulate upload progress (in real implementation, use XMLHttpRequest for progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await api.uploadFile(endpoint, file, additionalData)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      toast({
        title: "Upload Successful",
        description: "File uploaded successfully",
      })
      
      return response
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload file",
        variant: "destructive"
      })
      throw err
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  return { uploadFile, uploading, uploadProgress, error }
}

// Hook for paginated data
export function usePaginatedApi<T>(endpoint: string, pageSize: number = 10) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()

  const fetchPage = async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get<{
        data: T[]
        pagination: {
          currentPage: number
          totalPages: number
          hasMore: boolean
        }
      }>(`${endpoint}?page=${page}&limit=${pageSize}`)
      
      if (page === 1) {
        setData(response.data)
      } else {
        setData(prev => [...prev, ...response.data])
      }
      
      setCurrentPage(response.pagination.currentPage)
      setTotalPages(response.pagination.totalPages)
      setHasMore(response.pagination.hasMore)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: err.message || "Failed to fetch data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchPage(currentPage + 1)
    }
  }

  const refresh = () => {
    setData([])
    setCurrentPage(1)
    fetchPage(1)
  }

  useEffect(() => {
    fetchPage(1)
  }, [endpoint, pageSize])

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    hasMore,
    loadMore,
    refresh
  }
}
