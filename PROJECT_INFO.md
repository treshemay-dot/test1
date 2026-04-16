# School ID Scanner - Project Setup

Simple QR/Barcode scanner for school IDs that saves to Google Sheets by course.

## Project Features

- 📷 QR/Barcode camera scanning
- 🎓 Course selection (HM, IT, BSBA, CS, ENG)
- 💾 Google Sheets integration for database storage
- ✅ Success notifications
- 📱 Mobile-responsive design
- Minimal, clean UI

## Files Created

```
qrcs/
├── index.html              # Main UI with camera and controls
├── style.css              # Responsive design and styling
├── script.js              # QR scanning logic and Sheets integration
├── README.md              # Complete documentation
├── GOOGLE_SHEETS_SETUP.md # Step-by-step Google Sheets guide
└── QR_TEST_CODES.md       # Test QR codes for testing
```

## Quick Start

1. **Open the app**: Open `index.html` in a web browser
2. **Select course**: Choose from the dropdown
3. **Start scanning**: Click "Start Scan" button
4. **Point camera**: Aim at QR/Barcode
5. **Submit data**: Click "Submit to Database" after scan
6. **View results**: Check your Google Sheet

## Setup Requirements

### For Using the App
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Camera access permission
- Internet connection (for saving to Sheets)

### For Google Sheets Integration
1. Google Account
2. Follow **GOOGLE_SHEETS_SETUP.md** to:
   - Create Google Sheet
   - Set up Apps Script
   - Deploy the script
   - Update app with your URL

## Configuration

Update `script.js` line with your Apps Script URL:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_DEPLOYED_APPS_SCRIPT_URL';
```

## How It Works

1. User selects a course
2. Camera feed starts with permission prompt
3. App scans for QR/Barcode using jsQR library
4. Detected text displayed with course info
5. User submits data
6. Data sent to Google Sheets via Apps Script
7. Success notification appears
8. Form resets for next scan

## Testing

Test QR codes available in `QR_TEST_CODES.md` or generate your own at:
https://www.qr-code-generator.com/

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |

## Mobile Usage

Works perfectly on smartphones:
- Open `index.html` on mobile browser
- Allow camera access
- Scan QR codes like a normal app

## Customization

### Add More Courses
Edit `index.html` `<select>` element to add courses

### Change Colors
Edit `style.css` gradient and button colors

### Change Database Fields
Update Google Apps Script to save different data

## No Installation Required!

This is a **pure HTML/CSS/JavaScript** app - just open in browser!

---

**Status**: ✅ Ready to use

Next step: Follow `GOOGLE_SHEETS_SETUP.md` to connect to Google Sheets
