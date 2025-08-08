# 🔐 OAuth Setup Guide - Step by Step

## 📋 Step 1: Create Environment File

Create `.env.local` in your `/calculator` directory with this content:

```bash
# NextAuth.js
NEXTAUTH_SECRET=jZ8kV3mN9qR7tY5uW2xE1bG4hF6sA8pL
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

> 🔒 **Security Note**: Change the `NEXTAUTH_SECRET` to a unique 32-character string for production!

---

## 🌐 Step 2: Google OAuth Setup

### 2.1. Open Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select existing one

### 2.2. Enable APIs & Create Credentials
1. In the search bar, type "APIs & Services" and click on it
2. Click **"Library"** in the left sidebar
3. Search for **"Google+ API"** or **"People API"** 
4. Click on it and press **"Enable"**

### 2.3. Create OAuth Credentials
1. Go to **"Credentials"** in the left sidebar
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the **OAuth consent screen** first:
   - Choose **External** user type
   - Fill in **App name**: "Buy vs Rent Calculator"
   - Add your **email** in User support email
   - Add your **email** in Developer contact information
   - Click **"Save and Continue"** through all steps

### 2.4. Configure OAuth Client
1. Choose **"Web application"** as Application type
2. **Name**: "Buy vs Rent Calculator"
3. **Authorized redirect URIs**: Add these URLs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
4. Click **"Create"**

### 2.5. Copy Credentials
1. Copy **Client ID** and paste it in `.env.local` as `GOOGLE_CLIENT_ID`
2. Copy **Client Secret** and paste it in `.env.local` as `GOOGLE_CLIENT_SECRET`

---

## 🐙 Step 3: GitHub OAuth Setup

### 3.1. Open GitHub Settings
1. Go to [GitHub Settings](https://github.com/settings/applications/new)
2. Sign in to your GitHub account

### 3.2. Create New OAuth App
Fill in the form:
- **Application name**: `Buy vs Rent Calculator`
- **Homepage URL**: `http://localhost:3000`
- **Application description**: `Financial calculator for buy vs rent decisions`
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

### 3.3. Create Application
1. Click **"Register application"**
2. You'll see your new OAuth app page

### 3.4. Copy Credentials
1. Copy **Client ID** and paste it in `.env.local` as `GITHUB_CLIENT_ID`
2. Click **"Generate a new client secret"**
3. Copy **Client Secret** and paste it in `.env.local` as `GITHUB_CLIENT_SECRET`

---

## 🚀 Step 4: Test Authentication

### 4.1. Restart Development Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 4.2. Test Authentication Flow
1. Open `http://localhost:3000`
2. You should see a **"Sign In"** button
3. Click it to test OAuth providers
4. Try signing in with Google and/or GitHub

---

## ✅ Step 5: Verification Checklist

Make sure all these work:

- [ ] `.env.local` file exists with all credentials
- [ ] Google OAuth redirects work (if configured)
- [ ] GitHub OAuth redirects work (if configured)
- [ ] User can sign in and see their profile
- [ ] User can sign out successfully
- [ ] Guest mode still works (continue without account)

---

## 🔧 Troubleshooting

### Common Issues:

**1. "Invalid redirect URI"**
- Check callback URLs exactly match in OAuth app settings
- Make sure no trailing slashes

**2. "Client ID not found"**
- Verify environment variables are correct
- Check `.env.local` is in the correct directory

**3. "Authentication error"**
- Restart development server after changing `.env.local`
- Check OAuth app is not in "development mode" restriction

**4. "Failed to load session"**
- Clear browser cookies and localStorage
- Check `NEXTAUTH_SECRET` is set

---

## 🎯 Example .env.local File

```bash
# NextAuth.js
NEXTAUTH_SECRET=jZ8kV3mN9qR7tY5uW2xE1bG4hF6sA8pL
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-here

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
GITHUB_CLIENT_SECRET=ghp_your-secret-here
```

---

## 🌟 What's Next?

After successful OAuth setup:

1. ✅ Users can save calculator scenarios
2. ✅ Users can load saved scenarios  
3. ✅ Users have persistent accounts
4. ✅ Ready for production deployment

---

## 📞 Need Help?

If you encounter issues:
1. Check this guide step-by-step
2. Verify all URLs and credentials
3. Test with one provider first (recommend GitHub - simpler)
4. Check browser developer tools for error messages

**Remember**: OAuth setup is optional - the app works in guest mode too! 🎉

