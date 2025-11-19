# Debugging Guide

## Changes Made

1. **Added loading screen timeout** - After 10 seconds, the loading screen will automatically hide
2. **Added detailed console logging** - Check browser console to see where initialization stops
3. **Removed Arkadium SDK** - Using lightweight stub instead

## How to Debug

### Option 1: Check Vercel Deployment

1. Go to your Vercel URL (should auto-deploy in ~30 seconds)
2. Open browser DevTools (F12)
3. Go to Console tab
4. Look for these messages:
   - `🎮 Starting game initialization...`
   - `🎨 Initializing PixiJS...`
   - `🔊 Initializing sounds...`
   - `✅ Game initialization complete, hiding loading screen`

### Option 2: Test Locally

```bash
npm start
```

Then visit http://localhost:8080 and check the console.

## Common Issues

### Loading Screen Stuck

**Symptoms**: Loading screen shows forever

**Solutions**:
1. Wait 10 seconds - timeout will force hide it
2. Check console for errors
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Images Not Loading

**Symptoms**: Broken image icons

**Check**:
1. Open DevTools → Network tab
2. Look for 404 errors on assets
3. Verify files exist in `assets/` folder

### Console Errors

**Common errors and fixes**:

```
Error: Cannot read property 'X' of undefined
```
→ Check which initialization step failed in console logs

```
404 Not Found: assets/quotle-title.png
```
→ Assets not deployed, check git commit

```
Uncaught ReferenceError: ArkadiumIntegration is not defined
```
→ arkadium-integration-stub.js not loaded

## Debugging Checklist

- [ ] Check browser console for errors
- [ ] Verify all assets loaded (Network tab)
- [ ] Check if loading screen timeout triggered (10 sec)
- [ ] Try hard refresh (Ctrl+Shift+R)
- [ ] Try different browser
- [ ] Check Vercel deployment logs

## Quick Fixes

### Force Hide Loading Screen Manually

Open browser console and run:
```javascript
document.getElementById('loadingScreen').style.display = 'none';
document.body.classList.remove('loading');
```

### Check if Game Object Exists

```javascript
console.log(window.game);
```

### Manually Initialize Game

```javascript
window.game = new DailyQuotePuzzle();
```

## What to Look For

The console should show this sequence:
1. `📜 All scripts loaded`
2. `🎮 Starting game initialization...`
3. `🎨 Initializing PixiJS...`
4. `🔊 Initializing sounds...`
5. `🔌 Initializing Arkadium stub...`
6. `⚙️ Loading settings...`
7. `💾 Loading user data...`
8. `📅 No saved state found, loading today's puzzle`
9. `🎨 Rendering quote...`
10. `✅ Game initialization complete, hiding loading screen`

If it stops at any step, that's where the error is!

## Need More Help?

Share the console output and I can help debug further.
