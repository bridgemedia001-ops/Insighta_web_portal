# Insighta Labs+ Web Portal

A modern web interface for the Insighta Labs+ Profile Intelligence System, built with React, TypeScript, and TailwindCSS.

## 🚀 Features

- **GitHub OAuth Authentication**: Secure login using GitHub OAuth with PKCE
- **Role-Based Access Control**: Admin and Analyst roles with different permissions
- **Profile Management**: View, search, filter, and export profiles
- **Natural Language Search**: Query profiles using natural language
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Data**: Live connection to the backend API

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running at `https://insightiabackend-production.up.railway.app`
- GitHub OAuth application configured in the backend

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Insighta_web_portal
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure the backend URL:
```
VITE_BACKEND_URL=https://insightiabackend-production.up.railway.app
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` directory.

## 📦 Deployment

The application is designed to be deployed on platforms like Vercel, Netlify, or any static hosting service.

### Vercel Deployment

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure the environment variable `VITE_BACKEND_URL`
4. Deploy

### Environment Variables

- `VITE_BACKEND_URL`: The URL of the backend API (default: https://insightiabackend-production.up.railway.app)

## 🏛️ Architecture

### Project Structure

```
Insighta_web_portal/
├── src/
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   └── Layout.tsx   # Main layout with navigation
│   ├── pages/           # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── ProfilesList.tsx
│   │   ├── ProfileDetail.tsx
│   │   ├── Search.tsx
│   │   ├── Account.tsx
│   │   └── CreateProfile.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── package.json
```

### Authentication Flow

1. User clicks "Continue with GitHub"
2. Application generates PKCE parameters (state, code_verifier, code_challenge)
3. User is redirected to GitHub OAuth
4. GitHub redirects back with authorization code
5. Application exchanges code for access/refresh tokens
6. Tokens are stored in localStorage
7. JWT token is included in Authorization header for all API requests
8. Automatic token refresh on 401 responses

### API Integration

The web portal communicates with the backend via REST API:

- **Auth Endpoints**:
  - `GET /auth/github` - Initiate GitHub OAuth
  - `GET /auth/github/callback` - OAuth callback
  - `POST /auth/refresh` - Refresh access token
  - `POST /auth/logout` - Logout

- **Profile Endpoints**:
  - `GET /api/profiles` - List profiles with filters/pagination
  - `GET /api/profiles/:id` - Get single profile
  - `GET /api/profiles/search` - Natural language search
  - `POST /api/profiles` - Create profile (admin only)
  - `DELETE /api/profiles/:id` - Delete profile (admin only)
  - `GET /api/profiles/export` - Export to CSV

All API requests include:
- `Authorization: Bearer {access_token}` header
- `X-API-Version: 1` header

## 🔐 Security

- **JWT Authentication**: Access tokens expire in 3 minutes
- **Token Refresh**: Automatic refresh using refresh tokens (5 min expiry)
- **Role-Based Access**: Admin users have full access, Analysts have read-only
- **PKCE Flow**: Secure OAuth with Proof Key for Code Exchange
- **Protected Routes**: All pages except login require authentication

## 👥 User Roles

### Admin
- Create and delete profiles
- View and search all profiles
- Export profiles to CSV
- Access to admin endpoints

### Analyst
- View all profiles
- Search profiles with natural language
- Export profiles to CSV
- Cannot create or delete profiles

## 📄 Pages

### Login
- GitHub OAuth authentication
- PKCE security flow
- Error handling

### Dashboard
- Overview metrics (total profiles, gender distribution)
- Recent profiles
- Top countries
- Quick actions for admins

### Profiles List
- Filter by gender, country, age group, age range
- Sort by various fields
- Pagination
- Export to CSV
- Create new profile (admin only)

### Profile Detail
- View complete profile information
- Delete profile (admin only)
- Navigation back to list

### Search
- Natural language search queries
- Parsed query display
- Search results with pagination

### Account
- User profile information
- Role and permissions display
- Last login timestamp
- Sign out

## 🎨 UI Components

Reusable UI components built with TailwindCSS:
- Button (primary, secondary, danger, outline variants)
- Card (header, content, title)
- LoadingSpinner
- Form inputs

## 🐛 Troubleshooting

### Authentication Issues
- Ensure backend URL is correct in `.env`
- Check that GitHub OAuth is configured in backend
- Clear localStorage and try logging in again

### API Errors
- Check browser console for error messages
- Verify backend is running and accessible
- Check network tab in browser dev tools

### Build Errors
- Ensure Node.js version is 18+
- Delete `node_modules` and run `npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx` (if needed)

### Adding API Endpoints

1. Add TypeScript interface in `src/types/index.ts`
2. Add API method in `src/services/api.ts`
3. Use the method in your page components

## 🤝 Contributing

This is part of the Insighta Labs+ platform. Please follow the existing code style and conventions.

## 📄 License

ISC

## 🔗 Links

- Backend API: https://insightiabackend-production.up.railway.app
- CLI Repository: [link to CLI repo]
- Backend Repository: [link to Backend repo]
# Insighta_web_portal
