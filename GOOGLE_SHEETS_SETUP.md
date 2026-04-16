# Google Sheets Setup Guide

Follow these steps to connect your app to Google Sheets.

## Quick Setup (5 minutes)

### 1️⃣ Create a Google Sheet

```
Go to: https://sheets.google.com
→ Click "Create new spreadsheet"
→ Name it: "Student Attendance"
```

### 2️⃣ Add Column Headers

In your new sheet, create these headers in the first row:
- **A1**: `Timestamp`
- **B1**: `Student ID`
- **C1**: `Course`

### 3️⃣ Create Google Apps Script

```
Inside your Google Sheet:
→ Menu: "Tools" 
→ Select "Script Editor"
```

Replace everything with this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp,
      data.studentId,
      data.course
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 4️⃣ Deploy the Script

```
→ Click "Deploy" button
→ Select "New Deployment"
→ Type: Choose "Web app"
→ Execute as: Your email
→ Who has access: "Anyone"
→ Click "Deploy"
```

### 5️⃣ Copy Your Deployment URL

After deployment, you'll see a popup with your **Deployment URL**.
It looks like this:
```
https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb
```

**COPY THIS URL**

### 6️⃣ Update Your App

Open `script.js` and find this line:

```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Replace it with your actual URL:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb';
```

## Done! ✅

Your app is now ready to use. 

- Open `index.html` in browser
- Select a course
- Click "Start Scan"
- Scan a QR code
- Click "Submit to Database"
- Check your Google Sheet - the data should appear!

## Testing

1. Create a test QR code at: https://www.qr-code-generator.com/
2. Use this as test data: `STU12345` (student ID)
3. Scan it with the app
4. Submit and verify it appears in Google Sheets

## Troubleshooting

### "Cannot save to database"
- Check if your Apps Script URL is correct (copied fully)
- Try using a different browser
- Open browser console (F12 → Console tab) to see the error

### Data not appearing in Sheets
- Refresh your Google Sheet (press F5)
- Check if the script execution shows any errors:
  - In Google Apps Script editor: **Executions** tab
  - Look for red error messages

### Permission Denied
- Make sure you deployed as "Anyone" in the Apps Script
- Redeploy: Tools → All scripts → Find old deployment → Remove
- Create a new deployment with correct permissions

## Security Note

This is a simple educational setup. For production:
- Add authentication
- Validate data before saving
- Use HTTPS
- Add date/timestamp validation

---

Need help? Check the README.md file for more info!
