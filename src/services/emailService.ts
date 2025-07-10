// Email Service for Zavolah Energy Hub

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface EmailData {
  to: string
  from?: string
  subject: string
  html?: string
  text?: string
  template?: string
  data?: Record<string, any>
}

class EmailService {
  private apiKey: string
  private fromEmail: string

  constructor() {
    this.apiKey = import.meta.env.VITE_EMAIL_API_KEY || ''
    this.fromEmail = 'noreply@zavolah.com'
  }

  // Email Templates
  private templates: Record<string, (data: any) => EmailTemplate> = {
    welcome: (data) => ({
      subject: 'Welcome to Zavolah Energy Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #16a34a 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to Zavolah!</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Hello ${data.name},</h2>
            <p>Welcome to Zavolah Energy Hub! We're excited to have you join our community focused on sustainable energy solutions.</p>
            <p>Your account has been successfully created with the role: <strong>${data.role}</strong></p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>What's Next?</h3>
              <ul>
                <li>Explore our renewable energy marketplace</li>
                <li>Book consultations with our experts</li>
                <li>Join our academy for learning opportunities</li>
                <li>Access ZavCharge network for device charging</li>
              </ul>
            </div>
            <a href="https://zavolah.com/dashboard" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Started</a>
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280;">
            <p>© 2024 Zavolah Energy Hub. All rights reserved.</p>
          </div>
        </div>
      `,
      text: `Welcome to Zavolah Energy Hub!\n\nHello ${data.name},\n\nYour account has been successfully created with the role: ${data.role}\n\nVisit https://zavolah.com/dashboard to get started.\n\n© 2024 Zavolah Energy Hub. All rights reserved.`
    }),

    orderConfirmation: (data) => ({
      subject: `Order Confirmation - ${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #16a34a; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Thank you for your order, ${data.customerName}!</h2>
            <p>Your order <strong>#${data.orderId}</strong> has been confirmed and is being processed.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details:</h3>
              <p><strong>Total:</strong> ₦${data.total.toLocaleString()}</p>
              <p><strong>Items:</strong> ${data.itemCount} items</p>
              <p><strong>Delivery Address:</strong> ${data.deliveryAddress}</p>
              <p><strong>Expected Delivery:</strong> ${data.expectedDelivery}</p>
            </div>

            <a href="https://zavolah.com/buyer-dashboard" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Track Order</a>
          </div>
        </div>
      `,
      text: `Order Confirmed!\n\nThank you ${data.customerName}!\n\nOrder #${data.orderId} has been confirmed.\nTotal: ₦${data.total.toLocaleString()}\n\nTrack your order at: https://zavolah.com/buyer-dashboard`
    }),

    paymentConfirmation: (data) => ({
      subject: 'Payment Confirmation - Zavolah Energy Hub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #16a34a; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Payment Received</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Payment Confirmation</h2>
            <p>We have successfully received your payment of <strong>₦${data.amount.toLocaleString()}</strong> for ${data.description}.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Transaction Details:</h3>
              <p><strong>Reference:</strong> ${data.reference}</p>
              <p><strong>Amount:</strong> ₦${data.amount.toLocaleString()}</p>
              <p><strong>Date:</strong> ${data.date}</p>
              <p><strong>Method:</strong> ${data.paymentMethod}</p>
            </div>
          </div>
        </div>
      `,
      text: `Payment Confirmation\n\nWe received your payment of ₦${data.amount.toLocaleString()} for ${data.description}.\n\nReference: ${data.reference}\nDate: ${data.date}`
    }),

    zavchargeActivation: (data) => ({
      subject: 'ZavCharge Network Access Activated',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #16a34a 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">ZavCharge Access Activated!</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Welcome to ZavCharge Network</h2>
            <p>Your ${data.planType} subscription has been activated successfully!</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Access Details:</h3>
              <p><strong>Plan:</strong> ${data.planType}</p>
              <p><strong>Credits:</strong> ₦${data.credits.toLocaleString()}</p>
              <p><strong>Valid Until:</strong> ${data.expiryDate}</p>
              <p><strong>Access Code:</strong> ${data.accessCode || 'Use your registered phone number'}</p>
            </div>

            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>How to Use ZavCharge:</h3>
              <ol>
                <li>Find a ZavCharge station near you</li>
                <li>Scan QR code or enter your phone number</li>
                <li>Place your device in the secure locker</li>
                <li>Monitor charging progress remotely</li>
              </ol>
            </div>

            <a href="https://zavolah.com/zavcharge" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Find Stations</a>
          </div>
        </div>
      `,
      text: `ZavCharge Network Access Activated!\n\nYour ${data.planType} subscription is now active.\nCredits: ₦${data.credits.toLocaleString()}\nValid Until: ${data.expiryDate}\n\nFind stations at: https://zavolah.com/zavcharge`
    }),

    staffWelcome: (data) => ({
      subject: 'Welcome to Zavolah Staff Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f97316; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to the Team!</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Hello ${data.name},</h2>
            <p>Welcome to the Zavolah Energy Hub team! Your staff account has been successfully created.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3>Your Staff Details:</h3>
              <p><strong>Department:</strong> ${data.department}</p>
              <p><strong>Position:</strong> ${data.position}</p>
              <p><strong>Staff ID:</strong> ${data.staffId}</p>
            </div>

            <a href="https://zavolah.com/staff" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Access Staff Portal</a>
          </div>
        </div>
      `,
      text: `Welcome to Zavolah Staff Portal!\n\nHello ${data.name},\n\nYour staff account is ready.\nDepartment: ${data.department}\nPosition: ${data.position}\n\nAccess portal: https://zavolah.com/staff`
    }),

    twoFactorAuth: (data) => ({
      subject: 'Your Zavolah Security Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Security Code</h1>
          </div>
          <div style="padding: 20px;">
            <h2>Your Security Code</h2>
            <p>Use this code to complete your authentication:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h1 style="font-size: 36px; letter-spacing: 8px; color: #dc2626; margin: 0;">${data.code}</h1>
            </div>

            <p><strong>Important:</strong> This code expires in 5 minutes and can only be used once.</p>
            <p>If you didn't request this code, please contact our support team immediately.</p>
          </div>
        </div>
      `,
      text: `Your Zavolah Security Code: ${data.code}\n\nThis code expires in 5 minutes.\nIf you didn't request this, contact support immediately.`
    })
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // If using a template
      if (emailData.template && this.templates[emailData.template]) {
        const template = this.templates[emailData.template](emailData.data || {})
        emailData.subject = template.subject
        emailData.html = template.html
        emailData.text = template.text
      }

      // Mock implementation for development
      if (import.meta.env.VITE_DEBUG_MODE) {
        console.log('📧 Email would be sent:', {
          to: emailData.to,
          subject: emailData.subject,
          template: emailData.template
        })
        return true
      }

      // Production implementation would use your email service
      // Example: SendGrid, Mailgun, etc.
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          from: emailData.from || this.fromEmail,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text
        })
      })

      return response.ok
    } catch (error) {
      console.error('Email sending failed:', error)
      return false
    }
  }

  // Convenience methods for common emails
  async sendWelcomeEmail(to: string, name: string, role: string): Promise<boolean> {
    return this.sendEmail({
      to,
      template: 'welcome',
      data: { name, role }
    })
  }

  async sendOrderConfirmation(to: string, orderData: any): Promise<boolean> {
    return this.sendEmail({
      to,
      template: 'orderConfirmation',
      data: orderData
    })
  }

  async sendPaymentConfirmation(to: string, paymentData: any): Promise<boolean> {
    return this.sendEmail({
      to,
      template: 'paymentConfirmation',
      data: paymentData
    })
  }

  async sendZavChargeActivation(to: string, subscriptionData: any): Promise<boolean> {
    return this.sendEmail({
      to,
      template: 'zavchargeActivation',
      data: subscriptionData
    })
  }

  async sendStaffWelcome(to: string, staffData: any): Promise<boolean> {
    return this.sendEmail({
      to,
      template: 'staffWelcome',
      data: staffData
    })
  }

  async send2FACode(to: string, code: string): Promise<boolean> {
    return this.sendEmail({
      to,
      template: 'twoFactorAuth',
      data: { code }
    })
  }
}

export const emailService = new EmailService()
export default emailService
