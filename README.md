# Zavolah

A comprehensive renewable energy platform built with React, FastAPI, and Supabase.

## 🚀 Features

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Supabase + PostgreSQL
- **Authentication**: Supabase Auth with JWT
- **Payments**: Paystack integration
- **Real-time**: Ably for chat and notifications
- **File Upload**: Cloudinary integration
- **Dark/Light Theme**: Persistent theme switching
- **Mobile Responsive**: Works on all devices

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+ and pip
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd zavolah
```

### 2. Install Dependencies

```bash
# Install both frontend and backend dependencies
npm run setup
```

### 3. Environment Setup

#### Frontend (.env.local)
```env
VITE_SUPABASE_URL=https://mrqtmvxzqbvohvjbxgyg.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
VITE_CLOUDINARY_CLOUD_NAME=dr4xchzpi
VITE_ABLY_API_KEY=your_ably_api_key
```

#### Backend (backend/.env)
```env
SUPABASE_URL=https://mrqtmvxzqbvohvjbxgyg.supabase.co
SUPABASE_KEY=your_supabase_service_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
ABLY_API_KEY=your_ably_api_key
```

### 4. Database Setup

1. Go to your Supabase dashboard
2. Run the SQL from `backend/database_schema.sql` in the SQL Editor
3. This will create all necessary tables and policies

### 5. Run the Application

#### Development Mode (Full Stack)
```bash
npm run dev:full
```

#### Frontend Only
```bash
npm run dev
```

#### Backend Only
```bash
npm run backend:dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
zavolah/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and configs
│   └── services/          # API service layers
├── backend/               # FastAPI backend
│   ├── routes/            # API route handlers
│   ├── main.py            # FastAPI app entry point
│   └── requirements.txt   # Python dependencies
├── public/                # Static assets
└── README.md             # This file
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run backend:dev` - Start backend in development mode
- `npm run backend:prod` - Start backend in production mode
- `npm run backend:install` - Install Python dependencies

### Full Stack
- `npm run dev:full` - Start both frontend and backend
- `npm run setup` - Install all dependencies

## 🌟 Key Features Implemented

### Frontend
- ✅ Complete UI with dark/light theme
- ✅ Responsive design across all devices
- ✅ Global theme context with persistence
- ✅ Collapsible header with magic box animation
- ✅ All pages integrated with theme system
- ✅ Supabase authentication integration

### Backend
- ✅ FastAPI server with CORS configuration
- ✅ Supabase database integration
- ✅ JWT authentication system
- ✅ Complete API endpoints for all features
- ✅ Database schema with RLS policies
- ✅ Error handling and validation

### Database
- ✅ Complete PostgreSQL schema
- ✅ Row-level security policies
- ✅ Proper indexes for performance
- ✅ Sample data for testing

## 🔐 Security Features

- JWT authentication with Supabase
- Row-level security policies
- CORS configuration
- Input validation with Pydantic
- Secure environment variable handling

## 📊 Performance Optimizations

- Code splitting with React.lazy
- Optimized bundle with Vite
- Proper database indexes
- Efficient queries with Supabase
- Image optimization with Cloudinary

## 🚀 Deployment

### Frontend (Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Backend (Railway/Heroku)
1. Deploy the `backend` folder
2. Set environment variables
3. Update CORS origins for production

## 📞 Support

For questions or issues, contact:
- Email: contact@zavolah.com
- Phone: +234 806 640 4608

## 🎯 Next Steps

1. **Deploy to production** - Set up hosting for both frontend and backend
2. **Payment integration** - Configure Paystack webhooks
3. **Real-time features** - Implement Ably chat and notifications
4. **File uploads** - Set up Cloudinary for image/document uploads
5. **Testing** - Add comprehensive test coverage
6. **Performance** - Optimize for production workloads

---

Built with ❤️ by the Zavolah team
