# Deployment Guide for BuyOrRent.io

This guide provides instructions for deploying the Next.js application and connecting your `BuyOrRent.io` domain from Namecheap. We recommend using **Vercel** for deployment, as it's built by the creators of Next.js and offers a seamless experience.

## Step 1: Push Your Code to GitHub

Before deploying, ensure your latest code is pushed to a GitHub repository.

1.  **Create a GitHub Repository:** If you haven't already, create a new repository on [GitHub](https://github.com/new).
2.  **Push Your Project:**
    ```bash
    # Make sure you are in the root 'buy-or-rent' directory
    git init
    git add .
    git commit -m "Final version ready for deployment"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

## Step 2: Deploy to Vercel

1.  **Sign up for Vercel:** Go to [vercel.com](https://vercel.com) and sign up using your GitHub account.
2.  **Import Your Project:**
    *   From your Vercel dashboard, click "**Add New...**" -> "**Project**".
    *   Select your GitHub repository. Vercel will automatically detect that it's a Next.js project.
3.  **Configure Environment Variables:**
    *   During the import process, expand the "**Environment Variables**" section.
    *   Add all the variables from your `.env.local` file. This is crucial for Supabase authentication and Google Analytics to work in production.
        *   `NEXT_PUBLIC_SUPABASE_URL`
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        *   `SUPABASE_SERVICE_ROLE_KEY` (Mark this as "Secret")
        *   `DATABASE_URL` (Mark this as "Secret")
        *   `NEXT_PUBLIC_SITE_URL` (Set this to `https://buyorrent.io`)
        *   `NEXT_PUBLIC_GA_MEASUREMENT_ID`
4.  **Deploy:** Click the "**Deploy**" button. Vercel will build and deploy your application. After a few minutes, you'll get a Vercel URL (e.g., `your-project.vercel.app`).

## Step 3: Connect Your Domain (BuyOrRent.io)

1.  **Add Domain to Vercel:**
    *   In your Vercel project dashboard, go to the "**Settings**" tab and then "**Domains**".
    *   Enter `buyorrent.io` and click "**Add**".
    *   Vercel will recommend adding the `www` version (`www.buyorrent.io`) as well and will set up a redirect for you. It's a good practice to do so.
2.  **Configure DNS in Namecheap:**
    *   Vercel will now show you the DNS records you need to configure. It will likely be either an **A record** or **CNAME record**.
    *   Log in to your **Namecheap** account.
    *   Go to your "**Domain List**", find `buyorrent.io`, and click "**Manage**".
    *   Go to the "**Advanced DNS**" tab.
    *   **Delete any existing `@` or `www` records** (like `A`, `AAAA`, `CNAME`, or `URL Redirect` records) to avoid conflicts.
    *   **Add the new records provided by Vercel:**
        *   **If Vercel gives you an A record (an IP address):**
            *   Click "**ADD NEW RECORD**".
            *   **Type:** `A Record`
            *   **Host:** `@`
            *   **Value:** `[The IP address from Vercel]`
            *   **TTL:** `Automatic` or `60 min`
        *   **For the `www` version:**
            *   Click "**ADD NEW RECORD**".
            *   **Type:** `CNAME Record`
            *   **Host:** `www`
            *   **Value:** `cname.vercel-dns.com` (or whatever Vercel provides)
            *   **TTL:** `Automatic` or `60 min`
3.  **Wait for DNS Propagation:**
    *   DNS changes can take anywhere from a few minutes to 48 hours to take effect globally. Vercel will automatically check the status.
    *   Once the DNS is verified, Vercel will issue an SSL certificate for your domain, and your site will be live at `https://buyorrent.io`.

## Step 4: Update Supabase URL Configuration

For OAuth providers like Google and GitHub to work with your custom domain, you need to add your domain to Supabase's URL configuration.

1.  Go to your Supabase project dashboard.
2.  Navigate to **Authentication** -> **URL Configuration**.
3.  In the **Site URL** field, make sure it is set to `https://buyorrent.io`.
4.  Under **Redirect URLs**, add `https://buyorrent.io/auth/callback`.

That's it! Your site should now be live and fully functional on your custom domain.
