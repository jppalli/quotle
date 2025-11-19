# Deployment Guide for Quotle

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/jppalli/quotle.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

## GitHub Setup

1. Create a new repository at github.com/jppalli/quotle
2. Initialize and push:

```bash
git init
git add .
git commit -m "Initial commit: Quotle game"
git branch -M main
git remote add origin https://github.com/jppalli/quotle.git
git push -u origin main
```

## Environment Configuration

No environment variables needed for basic deployment.

## Post-Deployment Checklist

- [ ] Test the game on the live URL
- [ ] Verify all assets load correctly
- [ ] Test on mobile devices
- [ ] Check sound effects work
- [ ] Verify localStorage persistence
- [ ] Test achievement system

## Custom Domain (Optional)

In Vercel dashboard:
1. Go to Project Settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

**Assets not loading?**
- Check file paths are relative
- Verify all files are committed to git

**Game not working?**
- Check browser console for errors
- Ensure JavaScript files are loading

**LocalStorage issues?**
- Check browser privacy settings
- Test in incognito mode
