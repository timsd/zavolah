import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

export default function SecurityHeaders() {
  useEffect(() => {
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.paystack.co https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "connect-src 'self' https://api.paystack.co https://*.supabase.co https://cloudinary.com wss://*.supabase.co",
      "frame-src 'self' https://js.paystack.co",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')

    // Create or update CSP meta tag
    let cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement
    if (!cspMeta) {
      cspMeta = document.createElement('meta')
      cspMeta.httpEquiv = 'Content-Security-Policy'
      document.head.appendChild(cspMeta)
    }
    cspMeta.content = csp

    // X-Frame-Options
    let frameMeta = document.querySelector('meta[http-equiv="X-Frame-Options"]') as HTMLMetaElement
    if (!frameMeta) {
      frameMeta = document.createElement('meta')
      frameMeta.httpEquiv = 'X-Frame-Options'
      frameMeta.content = 'DENY'
      document.head.appendChild(frameMeta)
    }

    // X-Content-Type-Options
    let contentTypeMeta = document.querySelector('meta[http-equiv="X-Content-Type-Options"]') as HTMLMetaElement
    if (!contentTypeMeta) {
      contentTypeMeta = document.createElement('meta')
      contentTypeMeta.httpEquiv = 'X-Content-Type-Options'
      contentTypeMeta.content = 'nosniff'
      document.head.appendChild(contentTypeMeta)
    }

    // Referrer Policy
    let referrerMeta = document.querySelector('meta[name="referrer"]') as HTMLMetaElement
    if (!referrerMeta) {
      referrerMeta = document.createElement('meta')
      referrerMeta.name = 'referrer'
      referrerMeta.content = 'strict-origin-when-cross-origin'
      document.head.appendChild(referrerMeta)
    }
  }, [])

  return (
    <Helmet>
      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://js.paystack.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.paystack.co https://*.supabase.co; frame-src 'self' https://js.paystack.co; object-src 'none';" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />
    </Helmet>
  )
}
