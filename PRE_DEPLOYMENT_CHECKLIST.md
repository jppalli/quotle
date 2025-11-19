# ✅ Pre-Deployment Checklist

## Before You Deploy

### 1. Repository Setup
- [ ] GitHub repository created at https://github.com/jppalli/quotle
- [ ] Repository is public (or Vercel has access if private)
- [ ] Git initialized locally (`git init`)
- [ ] All files added (`git add .`)
- [ ] Initial commit created (`git commit -m "Initial commit"`)

### 2. Code Review
- [x] No hardcoded localhost URLs in production code
- [x] All file paths are relative
- [x] .gitignore configured properly
- [x] .vercelignore configured properly
- [x] vercel.json configured
- [x] package.json has correct repository URL

### 3. Local Testing
- [ ] Run `npm install` successfully
- [ ] Run `npm start` and test locally
- [ ] Game loads without errors
- [ ] Can complete a puzzle
- [ ] Sounds work (check browser console)
- [ ] Achievements unlock properly
- [ ] Calendar view works
- [ ] Statistics track correctly
- [ ] Mobile view looks good (test with browser dev tools)

### 4. Browser Testing
Test in at least 2 browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browser (Chrome Mobile or Safari iOS)

### 5. Feature Testing
- [ ] Daily puzzle loads
- [ ] Can select and unscramble words
- [ ] Letter selection works
- [ ] Backspace button works
- [ ] Reset button works
- [ ] Unscramble button works (with cooldown)
- [ ] Reveal letter button works
- [ ] Achievements unlock and display
- [ ] Ink drops system works
- [ ] Sound effects play
- [ ] Background music plays
- [ ] Settings save properly
- [ ] Calendar shows past puzzles
- [ ] Can play past challenges

### 6. Data Persistence
- [ ] Game state saves to localStorage
- [ ] Refresh page - progress persists
- [ ] Close and reopen browser - data persists
- [ ] Complete puzzle - stats update
- [ ] Achievements persist after refresh

### 7. Mobile Specific
- [ ] Touch controls work
- [ ] Layout responsive on small screens
- [ ] No horizontal scrolling
- [ ] Buttons are touch-friendly
- [ ] Modals display correctly
- [ ] Keyboard doesn't break layout

### 8. Performance
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] No console warnings (or acceptable ones)
- [ ] Images load properly
- [ ] Sounds load properly
- [ ] Smooth animations

### 9. Documentation
- [x] README.md complete
- [x] QUICKSTART.md created
- [x] DEPLOYMENT.md created
- [x] All documentation files present

### 10. Final Checks
- [ ] LICENSE file present
- [ ] package.json has correct info
- [ ] No sensitive data in code
- [ ] No API keys exposed
- [ ] All assets committed to git
- [ ] No broken links in documentation

## Deployment Steps

Once all checks pass:

```bash
# 1. Push to GitHub
git remote add origin https://github.com/jppalli/quotle.git
git push -u origin main

# 2. Deploy on Vercel
# Go to vercel.com → Import Project → Deploy

# 3. Test live site
# Visit your Vercel URL and test everything again
```

## Post-Deployment Verification

After deploying:
- [ ] Live site loads
- [ ] All assets load (check Network tab)
- [ ] Game is playable
- [ ] No console errors on live site
- [ ] Mobile version works
- [ ] Share URL with a friend - works for them

## Common Issues & Solutions

**Assets not loading?**
- Check file paths are relative
- Verify files are committed to git
- Check browser console for 404 errors

**Game not working?**
- Check browser console for JavaScript errors
- Verify all .js files loaded
- Test in incognito mode

**LocalStorage not working?**
- Check browser privacy settings
- Verify site is served over HTTPS (Vercel does this)
- Test in different browser

**Sounds not playing?**
- Check browser autoplay policy
- User must interact with page first
- Verify sound files are committed

## Ready to Deploy?

If all checks pass, you're ready! Follow QUICKSTART.md for deployment.

## Need Help?

- Check DEPLOYMENT.md for detailed instructions
- Review COMMANDS.md for command reference
- Check Vercel deployment logs for errors
- Test locally first with `npm start`

---

**Last Updated**: Ready for deployment!
