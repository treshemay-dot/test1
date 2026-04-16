# How to Download & Install the QR Scanner App on Your Phone

Your app is now a **Progressive Web App (PWA)**! You can install it on your phone like a regular app.

## Installation Methods

### 📱 Android Phone

#### Method 1: Using Chrome Browser (Recommended)
1. Open the app in Chrome browser
2. Look for **"Install app"** or **"Add to Home screen"** popup
   - If you don't see it, tap the **⋮ menu** (three dots)
   - Select **"Install app"** or **"Add to Home screen"**
3. Tap **"Install"** in the dialog
4. The app will download and appear on your home screen

#### Method 2: Manual Add to Home Screen
1. Open the app in any browser
2. Long press on the address bar URL
3. Tap **"Add to Home screen"**
4. Choose a name and tap **"Add"**

### 🍎 iPhone/iPad

#### Using Safari Browser
1. Open the app in **Safari** browser
2. Tap the **Share button** (arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Enter an app name
5. Tap **"Add"** in the top right
6. The app will appear on your home screen

> **Note**: iPhone PWAs work best in iOS 15+

### 💻 Desktop (Windows/Mac)

#### Using Chrome or Edge Browser
1. Open the app in the browser
2. Look for the **install icon** in the address bar (looks like a small square with arrow)
3. Click it and select **"Install"**
4. The app will install and open in a separate window
5. A shortcut will be created on your desktop

## Using the Downloaded App

Once installed, the app works like a normal app:

✅ Open directly from home screen icon  
✅ Works offline (for scanning, not saving)  
✅ Full camera access  
✅ Push notifications (when set up)  
✅ No browser address bar  

## Running Locally for Testing

### Option 1: Simple Local Server (Python)
If you have Python installed:

```bash
# Python 3.x
python -m http.server 8000

# Then open: http://localhost:8000
```

### Option 2: Node.js Server
```bash
# Install http-server (one-time)
npm install -g http-server

# Run server in your project folder
http-server

# Then open the URL shown (usually http://localhost:8080)
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"
4. It opens in your default browser

## Upload to Web Server (For Real Deployment)

To make your app accessible from anywhere:

### Using Vercel (Free - Recommended)
1. Create account at https://vercel.com
2. Connect your GitHub or upload files directly
3. Click "Deploy"
4. Get a live URL like: `https://yourapp.vercel.app`
5. Share this URL on phones to install

### Using Netlify (Free)
1. Go to https://netlify.com
2. Drag and drop your `qrcs` folder
3. Deploy instantly
4. Get a shareable URL
5. Anyone can install it

### Using GitHub Pages
1. Create a GitHub account
2. Create a repository named `qrcs`
3. Upload your files
4. Enable GitHub Pages in settings
5. Your app is live at: `https://yourusername.github.io/qrcs`

## Important: HTTPS Requirement

**PWA installation requires HTTPS** (except localhost for testing).

If you're testing locally:
- ✅ Works fine on `http://localhost`
- ❌ Won't install on `http://yourip:port` (on LAN)

For LAN testing, use a local server and access via localhost on that machine.

## Testing Installation

**Before sharing, test the installation process:**

1. Clear browser cache and cookies
2. Visit your app URL fresh
3. Check if install prompt appears
4. Try installing from home screen
5. Test all features work offline
6. Verify camera access still works

## Troubleshooting

### "Install button not showing"
- Make sure you're using HTTPS (or localhost)
- Try a different browser (Chrome works best)
- Clear browser cache
- Wait a few seconds after page loads

### "App not working offline"
- Service worker may still be installing
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Clear app data and reinstall

### "Camera not working"
- Grant camera permissions when prompted
- Check browser permissions in phone settings
- Try reopening the app

### "Data not saving to Google Sheets"
- Confirm internet connection is active
- Check that Google Apps Script URL is correct
- Open browser console (F12) for error messages

## Platform-Specific Notes

### Android
- Works on all modern Android versions (6+)
- Can be shared via QR code or link
- Can be sideloaded or distributed through own store

### iOS
- Requires iOS 15+ (iPhone 6s or newer)
- PWA features limited compared to Android
- Usually requires being opened in Safari

### Desktop
- Works on Windows 10/11
- Works on macOS
- App appears as separate program (not browser)

## Next Steps

1. **Test locally** with `http://localhost`
2. **Upload to Vercel/Netlify** for free hosting
3. **Share the URL** with users
4. **Users install** by clicking install prompt or share menu

---

**That's it!** Your app is now installable like a native app! 🎉
