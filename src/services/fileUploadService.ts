// File Upload Service for Cloudinary Integration

import { api } from '@/lib/api'

interface UploadResponse {
  success: boolean
  url: string
  publicId: string
  format: string
  width?: number
  height?: number
  size: number
}

interface UploadOptions {
  folder?: string
  transformation?: string
  quality?: 'auto' | number
  format?: string
  tags?: string[]
}

class FileUploadService {
  private cloudName: string

  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
  }

  // Upload single file
  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (options.folder) formData.append('folder', options.folder)
      if (options.transformation) formData.append('transformation', options.transformation)
      if (options.quality) formData.append('quality', options.quality.toString())
      if (options.format) formData.append('format', options.format)
      if (options.tags) formData.append('tags', options.tags.join(','))

      const response = await api.uploadFile<UploadResponse>('/upload/single', file, {
        folder: options.folder || 'general',
        transformation: options.transformation || '',
        quality: options.quality?.toString() || 'auto',
        format: options.format || 'auto',
        tags: options.tags?.join(',') || ''
      })
      
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload file')
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files: File[], options: UploadOptions = {}): Promise<UploadResponse[]> {
    try {
      const uploadPromises = files.map(file => this.uploadFile(file, options))
      const responses = await Promise.all(uploadPromises)
      return responses
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload files')
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<UploadResponse> {
    return this.uploadFile(file, {
      folder: 'profile-pictures',
      transformation: 'c_fill,g_face,h_200,w_200',
      quality: 'auto',
      format: 'jpg'
    })
  }

  // Upload product image
  async uploadProductImage(file: File): Promise<UploadResponse> {
    return this.uploadFile(file, {
      folder: 'products',
      transformation: 'c_fill,h_400,w_400',
      quality: 'auto',
      format: 'jpg'
    })
  }

  // Upload document (PDF, DOC, etc.)
  async uploadDocument(file: File): Promise<UploadResponse> {
    return this.uploadFile(file, {
      folder: 'documents',
      tags: ['document']
    })
  }

  // Upload CV/Resume
  async uploadCV(file: File): Promise<UploadResponse> {
    return this.uploadFile(file, {
      folder: 'cvs',
      tags: ['cv', 'resume']
    })
  }

  // Upload marketplace design images
  async uploadDesignImages(files: File[]): Promise<UploadResponse[]> {
    return this.uploadMultipleFiles(files, {
      folder: 'marketplace/designs',
      transformation: 'c_fill,h_600,w_800',
      quality: 'auto',
      format: 'jpg',
      tags: ['marketplace', 'design']
    })
  }

  // Delete file
  async deleteFile(publicId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete<{ success: boolean; message: string }>(`/upload/delete/${publicId}`)
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete file')
    }
  }

  // Get file info
  async getFileInfo(publicId: string): Promise<any> {
    try {
      const response = await api.get<any>(`/upload/info/${publicId}`)
      return response
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get file info')
    }
  }

  // Validate file type
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type)
  }

  // Validate file size (in MB)
  validateFileSize(file: File, maxSizeMB: number): boolean {
    const fileSizeMB = file.size / (1024 * 1024)
    return fileSizeMB <= maxSizeMB
  }

  // Get file size in human readable format
  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Generate thumbnail URL
  generateThumbnail(publicId: string, width: number = 200, height: number = 200): string {
    return `https://res.cloudinary.com/${this.cloudName}/image/upload/c_fill,h_${height},w_${width}/${publicId}`
  }
}

export const fileUploadService = new FileUploadService()
export type { UploadResponse, UploadOptions }
