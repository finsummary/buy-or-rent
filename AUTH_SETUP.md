# 🔐 Authentication Setup Guide

## 📋 Quick Start

### 1. Create Environment File
Create `.env.local` in the root directory:

```bash
# NextAuth.js
NEXTAUTH_SECRET=your-super-secret-key-32-chars-long
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (Optional)  
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2. Generate Secret Key
```bash
# Generate secure secret
openssl rand -base64 32
# Or use online generator: https://generate-secret.vercel.app/32
```

### 3. Initialize Database
```bash
npm run db:generate   # Generate migrations
npm run db:migrate    # Apply migrations (optional - auto-created)
```

---

## 🔧 OAuth Providers Setup

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy **Client ID** and **Client Secret** to `.env.local`

### GitHub OAuth Setup
1. Go to [GitHub Settings](https://github.com/settings/applications/new)
2. Click **New OAuth App**
3. Fill in details:
   - **Application name**: Buy vs Rent Calculator
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy **Client ID** and **Client Secret** to `.env.local`

---

## 🚀 Features Implemented

### ✅ Authentication System
- **NextAuth.js v5** (beta) with App Router support
- **Google OAuth** integration
- **GitHub OAuth** integration
- **Guest mode** (continue without account)

### ✅ Database
- **SQLite** with Better-SQLite3 driver
- **Drizzle ORM** for type-safe database operations
- **User accounts** and **scenarios** tables
- **Automatic migrations**

### ✅ User Features
- **Save scenarios** with custom names
- **Load saved scenarios**
- **User profile** with avatar
- **Session management**

### ✅ Security
- **JWT tokens** for session management
- **CSRF protection** built-in
- **Secure cookies** configuration
- **TypeScript** for type safety

---

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Database commands
npm run db:generate  # Generate migrations from schema
npm run db:migrate   # Apply migrations to database  
npm run db:studio    # Open Drizzle Studio (database GUI)

# Build for production
npm run build
npm start
```

---

## 📱 Usage Flow

1. **Guest Mode**: Users can use calculator without signing in
2. **Sign In**: Click "Sign In" to authenticate with Google/GitHub  
3. **Save Scenarios**: Authenticated users can save their calculations
4. **Load Scenarios**: Access saved scenarios from user menu
5. **Manage Account**: View profile, sign out

---

## 🚀 Deployment Ready

### Railway.app (Recommended)
1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on git push
4. SQLite file persists with Railway's volume storage

### Alternative Platforms
- **Render.com** - Free tier with persistent disk
- **Fly.io** - Excellent SQLite support
- **DigitalOcean App Platform** - Simple deployment

### ⚠️ Not Recommended
- **Vercel** - Read-only filesystem (SQLite won't work)
- **Netlify** - Static hosting only

---

## 🔍 Troubleshooting

### Database Issues
```bash
# Reset database
rm sqlite.db
npm run db:generate
```

### Authentication Issues
- Check `.env.local` file exists and has correct values
- Verify OAuth callback URLs match exactly
- Ensure `NEXTAUTH_SECRET` is set

### Development Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📊 Current Status

✅ **Authentication system ready**
✅ **Database schema created**  
✅ **API endpoints implemented**
⏳ **OAuth credentials setup needed**
⏳ **Integration with main calculator**

Next step: Set up OAuth credentials and integrate with calculator UI!


