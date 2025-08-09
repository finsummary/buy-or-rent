# 🚀 Supabase Setup Guide for BuyOrRent.io

## 📋 Quick Start

This guide will help you set up Supabase for the BuyOrRent.io project. We've migrated from NextAuth.js + SQLite to Supabase Auth + PostgreSQL for a better, more scalable solution.

## 🏗️ Step 1: Create Supabase Project

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up or log in**
3. **Click "New Project"**
4. **Fill in project details:**
   - Organization: Create new or select existing
   - Name: `buyorrent-io`
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
   - Pricing Plan: Start with Free tier

## 🔑 Step 2: Get Your Credentials

After project creation, go to **Settings** → **API**:

1. **Project URL**: `https://your-project-id.supabase.co`
2. **Anon (public) key**: `eyJhbGc...` (starts with eyJ)
3. **Service role key**: `eyJhbGc...` (different from anon key)

## 📝 Step 3: Configure Environment Variables

Create `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database (PostgreSQL connection string)
DATABASE_URL=postgresql://postgres.your-project-id:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Site URL (for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 🔗 Getting Database URL

1. **Go to Settings** → **Database**
2. **Copy "Connection string"** under "Connection parameters"
3. **Format**: `postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:6543/postgres`

## 🔐 Step 4: Configure Authentication

### Enable OAuth Providers

1. **Go to Authentication** → **Providers**
2. **Enable Google OAuth:**
   - Toggle "Google" to enabled
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com):
     - Create OAuth 2.0 Client ID
     - Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Enter Client ID and Client Secret

3. **Enable GitHub OAuth:**
   - Toggle "GitHub" to enabled  
   - Get credentials from [GitHub Developer Settings](https://github.com/settings/developers):
     - Create new OAuth App
     - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
   - Enter Client ID and Client Secret

### Configure Site URL

1. **Go to Authentication** → **URL Configuration**
2. **Set Site URL**: `http://localhost:3000` (for development)
3. **Add Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://buyorrent.io/auth/callback` (for production)

## 🗄️ Step 5: Set Up Database Schema

### Method 1: Using Drizzle (Recommended)

```bash
# Generate and push schema to Supabase
npm run db:generate
npm run db:push
```

### Method 2: Manual SQL (Supabase SQL Editor)

Go to **SQL Editor** in Supabase dashboard and run:

```sql
-- Create scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scenarios_updated_at 
  BEFORE UPDATE ON scenarios 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS scenarios_user_id_idx ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS scenarios_updated_at_idx ON scenarios(updated_at DESC);
```

## 🛡️ Step 6: Configure Row Level Security (RLS)

Enable RLS to ensure users can only access their own data:

```sql
-- Enable RLS on scenarios table
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own scenarios
CREATE POLICY "Users can view own scenarios" ON scenarios
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own scenarios  
CREATE POLICY "Users can insert own scenarios" ON scenarios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own scenarios
CREATE POLICY "Users can update own scenarios" ON scenarios
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own scenarios
CREATE POLICY "Users can delete own scenarios" ON scenarios
  FOR DELETE USING (auth.uid() = user_id);
```

## 🧪 Step 7: Test the Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test authentication:**
   - Go to `http://localhost:3000/auth/signin`
   - Try signing in with Google or GitHub
   - Verify user data appears in Supabase dashboard

3. **Test scenario management:**
   - Create a new scenario in the app
   - Check if it appears in the Supabase database
   - Try loading/deleting scenarios

## 🚀 Step 8: Production Deployment

### Update Environment Variables

For production deployment, update:

```env
NEXT_PUBLIC_SITE_URL=https://buyorrent.io
```

### Update OAuth Redirect URLs

1. **Google Cloud Console:**
   - Add: `https://buyorrent.io` to Authorized JavaScript origins
   - Add: `https://buyorrent.io/auth/callback` to Authorized redirect URIs

2. **GitHub OAuth App:**
   - Update Homepage URL to: `https://buyorrent.io`
   - Update Authorization callback URL to: `https://buyorrent.io/auth/callback`

3. **Supabase Authentication:**
   - Update Site URL to: `https://buyorrent.io`
   - Add redirect URL: `https://buyorrent.io/auth/callback`

## 🔍 Troubleshooting

### Common Issues

**1. "Invalid redirect URL" error:**
- Check OAuth redirect URLs in Google/GitHub
- Verify Supabase redirect URLs configuration
- Ensure NEXT_PUBLIC_SITE_URL is correct

**2. Database connection issues:**
- Verify DATABASE_URL format
- Check Supabase project is not paused
- Ensure correct password in connection string

**3. Authentication not working:**
- Verify all environment variables are set
- Check Supabase auth providers are enabled
- Look at browser network tab for error details

**4. RLS blocking data access:**
- Verify RLS policies are correctly set
- Check user is properly authenticated
- Use Supabase auth.uid() in policies

### Useful Commands

```bash
# Check environment variables
npm run env

# Generate new migration
npm run db:generate

# Push schema changes
npm run db:push

# View database
npm run db:studio
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## ✅ Migration Complete!

Your BuyOrRent.io app is now powered by Supabase! 🎉

Benefits you now have:
- ✅ **Simplified Auth**: No more NextAuth.js complexity
- ✅ **PostgreSQL**: More powerful than SQLite
- ✅ **Real-time Ready**: WebSockets built-in
- ✅ **Automatic Security**: RLS policies protect data
- ✅ **Scalable**: Production-ready infrastructure

