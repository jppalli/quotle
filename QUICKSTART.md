# Quick Start Guide

## 🚀 Deploy to Vercel in 5 Minutes

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Quotle game ready for deployment"

# Add your GitHub repository
git remote add origin https://github.com/jppalli/quotle.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

**Option A: Via Vercel Dashboard (Easiest)**

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select your `quotle` repository
5. Click "Deploy" (no configuration needed!)
6. Wait ~30 seconds
7. Your game is live! 🎉

**Option B: Via CLI**

```bash
npm install -g vercel
vercel login
vercel
```

### Step 3: Test Your Deployment

Visit your Vercel URL and test:
- [ ] Game loads correctly
- [ ] Can play a puzzle
- [ ] Sounds work
- [ ] Achievements unlock
- [ ] Mobile view works

## 🎮 Local Development

```bash
npm install
npm start
```

Visit http://localhost:8080

## 📝 What's Included

- ✅ Vercel configuration
- ✅ Git ignore rules
- ✅ Production-ready code
- ✅ Mobile responsive
- ✅ All game features working

## 🔗 Your URLs

After deployment:
- Production: `https://quotle.vercel.app` (or your custom domain)
- GitHub: `https://github.com/jppalli/quotle`

## 💡 Tips

- Vercel auto-deploys on every push to main
- Use branches for testing new features
- Check Vercel dashboard for deployment logs
- Custom domains can be added in Vercel settings

## 🆘 Need Help?

Check these files:
- `DEPLOYMENT.md` - Detailed deployment guide
- `PRODUCTION_NOTES.md` - Technical details
- `README.md` - Project overview
