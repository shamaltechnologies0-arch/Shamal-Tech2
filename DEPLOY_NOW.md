# Quick Start: Deploy to Vercel

## ✅ Project is Ready for Vercel!

Your Next.js + Payload CMS project is configured for Vercel deployment.

## 🚀 Quick Deployment Steps

### Step 1: Login to Vercel
Run this command in your terminal:
```bash
vercel login
```
This will open your browser to authenticate.

### Step 2: Prepare Environment Variables
Before deploying, make sure you have:
- **MONGODB_URI** - Your MongoDB connection string
- **PAYLOAD_SECRET** - Generate with: `openssl rand -base64 32`
- **NEXT_PUBLIC_SERVER_URL** - Will be set automatically, but you can set it to your custom domain later

### Step 3: Deploy
Run:
```bash
vercel
```

Follow the prompts:
- Link to existing project? **No** (for first deployment)
- Project name? **Press Enter** (uses repo name)
- Directory? **Press Enter** (uses current directory)
- Override settings? **No**

### Step 4: Set Environment Variables
After first deployment, set environment variables:
```bash
vercel env add MONGODB_URI
vercel env add PAYLOAD_SECRET
```

Or use the Vercel Dashboard:
1. Go to your project on vercel.com
2. Settings → Environment Variables
3. Add each variable for Production, Preview, and Development

### Step 5: Deploy to Production
```bash
vercel --prod
```

## 📋 Alternative: Deploy via Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository: `ehsanksa/Shamal-Tech2`
3. Configure environment variables in the dashboard
4. Click "Deploy"

## 📝 Files Created for Vercel

- ✅ `vercel.json` - Vercel configuration
- ✅ Updated `next.config.js` - Better Vercel support
- ✅ `VERCEL_DEPLOYMENT.md` - Detailed deployment guide

## ⚠️ Important Notes

- **MongoDB**: Must use MongoDB Atlas or cloud MongoDB (not local)
- **First Build**: May take 5-10 minutes
- **Admin Panel**: Access at `/admin` after deployment

## 🆘 Need Help?

See `VERCEL_DEPLOYMENT.md` for detailed instructions.
