# Quick Deploy Guide - Get Your App on Your Phone in 5 Minutes

## The Easiest Way: Deploy to Vercel (Free)

### Step 1: Prepare Your Files (1 min)
Zip all these files from your `qrcs` folder:
```
✓ index.html
✓ style.css
✓ script.js
✓ manifest.json
✓ service-worker.js
```

### Step 2: Create Vercel Account (2 min)
1. Go to https://vercel.com
2. Click "Sign Up"
3. Use GitHub, GitLab, or email
4. Verify email

### Step 3: Deploy (1 min)
1. In Vercel dashboard, click "Add New..." → "Project"
2. Select "Deploy directly"
3. Drag and drop your `qrcs` folder
4. Click "Deploy"
5. Wait 30 seconds...
6. **Your app is live!** 🎉

### Step 4: Access on Phone (1 min)
1. Copy your deployment URL (like `https://yourapp-abc123.vercel.app`)
2. Open on phone in any browser
3. Install app (see PWA_INSTALLATION.md)

---

## Alternative: Deploy to Netlify (Free)

### Quick Steps:
1. Go to https://netlify.com
2. Sign up with email or GitHub
3. Click "Add new site" → "Deploy manually"
4. Drag and drop your `qrcs` folder
5. Done! Get your live URL

---

## Alternative: Local Testing Only

### Using Python (Easiest)
```bash
cd c:\Users\PCx\Desktop\qrcs

# Python 3
python -m http.server 8000

# Then open: http://localhost:8000
```

### Using Node.js
```bash
npm install -g http-server
http-server
```

---

## Testing the App

**First time setup:**
1. Get your deployment URL from Vercel/Netlify
2. Test in browser desktop first
3. Open same URL on your phone
4. Follow PWA_INSTALLATION.md to install

**Quick Checklist:**
- [ ] Camera permission works
- [ ] Can scan QR code
- [ ] Course selection works
- [ ] Shows success notification
- [ ] Can submit to Google Sheets

---

## Still Need Help?

1. **Installation not showing?** → See PWA_INSTALLATION.md
2. **App not scanning?** → See QR_TEST_CODES.md
3. **Google Sheets not saving?** → See GOOGLE_SHEETS_SETUP.md
4. **Want to customize?** → Edit style.css for colors, index.html for courses

---

## File Structure (Complete)

```
qrcs/
├── index.html              ✓ Main app interface
├── style.css              ✓ Responsive design
├── script.js              ✓ Scanning + PWA registration
├── manifest.json          ✓ PWA app metadata
├── service-worker.js      ✓ Offline support
├── README.md              ✓ Full documentation
├── GOOGLE_SHEETS_SETUP.md ✓ Database setup
├── PWA_INSTALLATION.md    ✓ Phone installation
└── QR_TEST_CODES.md       ✓ Testing guide
```

**Ready to deploy?** Choose Vercel or Netlify above and you'll have a working phone app in 5 minutes! 📱
