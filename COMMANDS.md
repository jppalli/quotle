# Command Reference

## 🚀 Deployment Commands

### First Time Setup

```bash
# 1. Initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/jppalli/quotle.git
git push -u origin main

# 2. Deploy to Vercel
npm install -g vercel
vercel login
vercel --prod
```

### Subsequent Deployments

```bash
# Make changes, then:
git add .
git commit -m "Your commit message"
git push

# Vercel auto-deploys on push!
# Or manually deploy:
npm run deploy
```

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm start
# or
npm run dev

# Visit http://localhost:8080
```

## 🔧 Git Commands

```bash
# Check status
git status

# View changes
git diff

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Merge branch
git merge feature-name

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- .
```

## 📦 Vercel Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs

# Remove deployment
vercel rm [deployment-url]
```

## 🔍 Debugging

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## 🌐 Testing

```bash
# Test locally
npm start

# Test on different port
npx http-server . -p 3000

# Test with HTTPS (for testing PWA features)
npx http-server . -p 8080 -S -C cert.pem
```

## 📱 Mobile Testing

```bash
# Find your local IP
# Windows:
ipconfig

# Mac/Linux:
ifconfig

# Then visit http://YOUR-IP:8080 on mobile
```

## 🔐 Environment

```bash
# Set environment variable (if needed)
export NODE_ENV=production

# Windows:
set NODE_ENV=production
```

## 🎯 Quick Commands

```bash
# Full deployment workflow
git add . && git commit -m "Update" && git push

# Quick local test
npm start

# Deploy to production
npm run deploy
```
