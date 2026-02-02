# Vercel Deployment Guide

This project is configured for deployment on Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account (or another MongoDB hosting service)
3. GitHub repository (recommended) or GitLab/Bitbucket

## Required Environment Variables

Set these in your Vercel project settings:

### Required Variables:
- `MONGODB_URI` - Your MongoDB connection string. **For M0 + Vercel**, add `?maxPoolSize=5&minPoolSize=0&maxIdleTimeMS=60000` to stay under the 500 connection limit (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/dbname?maxPoolSize=5&minPoolSize=0&maxIdleTimeMS=60000`)
- `PAYLOAD_SECRET` - A random secret string for Payload CMS encryption (generate with: `openssl rand -base64 32`)
- `NEXT_PUBLIC_SERVER_URL` - Your production URL (e.g., `https://your-domain.vercel.app`)

### Optional Variables:
- `SMTP_HOST` - SMTP server hostname (if using email)
- `SMTP_PORT` - SMTP port (usually 587)
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password
- `SMTP_FROM` - From email address
- `CONTACT_EMAIL` - Contact form recipient email
- `NEWSLETTER_API_KEY` - Newsletter service API key
- `NEWSLETTER_AUDIENCE_ID` - Newsletter audience/list ID
- `CRON_SECRET` - Secret for cron job authentication

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository:**
   - Go to https://vercel.com/new
   - Import your GitHub/GitLab/Bitbucket repository
   - Select the repository

2. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `pnpm install` (auto-detected)

3. **Set Environment Variables:**
   - Click "Environment Variables"
   - Add all required variables listed above
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts to:
   - Link to existing project or create new
   - Set up environment variables
   - Deploy

4. **For Production:**
   ```bash
   vercel --prod
   ```

## Post-Deployment

1. **Update NEXT_PUBLIC_SERVER_URL:**
   - After first deployment, update `NEXT_PUBLIC_SERVER_URL` in Vercel environment variables to your actual domain
   - Redeploy if needed

2. **Access Admin Panel:**
   - Navigate to `https://your-domain.vercel.app/admin`
   - Create your first admin user

3. **Configure Custom Domain (Optional):**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed

## Important Notes

- **MongoDB:** Use MongoDB Atlas or another cloud MongoDB service. Local MongoDB won't work on Vercel.
- **File Storage:** Currently using local storage. For production, consider configuring S3 storage.
- **Build Time:** First build may take 5-10 minutes. Subsequent builds are faster.
- **Serverless Functions:** Payload CMS runs as serverless functions on Vercel, which is fully supported.

## Troubleshooting

- **Build Fails:** Check build logs in Vercel dashboard for specific errors
- **Database Connection Issues:** Verify `MONGODB_URI` is correct and MongoDB Atlas allows connections from Vercel IPs (0.0.0.0/0)
- **"cannot connect to MongoDB" / 500 errors:** M0 clusters limit 500 connections. Add `maxPoolSize=5` to your connection string and redeploy. See `MONGODB_OPTIMIZATION.md`.
- **Admin Panel Not Loading:** Ensure `PAYLOAD_SECRET` and `NEXT_PUBLIC_SERVER_URL` are set correctly
