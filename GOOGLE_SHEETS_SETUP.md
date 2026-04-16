# Google Sheets Setup Guide

Follow these steps to connect your app to Google Sheets with the new offline-first architecture.

## Quick Setup (5 minutes)

### 1️⃣ Create a Google Sheet

```
Go to: https://sheets.google.com
→ Click "Create new spreadsheet"
→ Name it: "Student Attendance"
```

### 2️⃣ Add Column Headers

In your new sheet, create these headers in **Row 1**:
- **A1**: `Timestamp`
- **B1**: `Student ID`
- **C1**: `Name`
- **D1**: `Course`

**Important:** Data will start in Row 2.

### 3️⃣ Create Google Apps Script

```
Inside your Google Sheet:
→ Menu: "Tools" 
→ Select "Script Editor"
```

Replace everything with this updated code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Insert new row with all data
    sheet.appendRow([
      data.timestamp,
      data.studentId,
      data.name,
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

Open `script.js` and find this line at the top:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNIeBOonWRcp8wdlrsaYdtOpWB3ZZqcMnOZDuVsvmkg2fD_eonNUBy7Zxx7jc9ADhO/exec';
```

Replace it with your actual Apps Script URL:

```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/userweb';
```

## ✨ New Features

### Offline Mode
- **Works without internet** - Data saves locally in your device
- **Temporary storage** - Uses IndexedDB to store records
- **Auto-sync** - Syncs to Google Sheets when online

### Data Management
- **View all records** - See saved records in a table
- **Delete individual records** - Click the trash icon
- **Select & delete multiple** - Use checkboxes to delete in bulk
- **Clear all** - Delete all records at once

### Student Data
- **Scan QR code** - Captures student ID
- **Enter name manually** - Add student name after scanning
- **Select course** - Choose from predefined courses
- **Timestamp** - Automatically recorded

## How to Use

### Scanning & Saving
1. Open `index.html` in your browser
2. Select a **Course** from dropdown
3. Click **▶ Start Scan**
4. Point camera at QR/Barcode (shows student ID)
5. Enter **Student Name** manually
6. Click **💾 Save Record**
7. Record saves locally ✓

### If Online
- Record syncs to Google Sheets automatically ⏳ Pending → ✓ Synced
- Sync button shows real-time sync status

### If Offline
- Record saves locally (📶 Offline - Pending sync)
- Click **↻ Sync** button when back online
- All pending records upload automatically

### Viewing Records
1. Click **📊 Data** tab to see all records
2. View Timestamp, ID, Name, Course, and Sync Status
3. **Delete single** - Click 🗑 on any row
4. **Select multiple** - Tick checkboxes and click "🗑 Delete Selected"
5. **Clear all** - Click "⚠ Clear All" (careful! can't undo)

## Testing

1. Create test QR codes at: https://www.qr-code-generator.com/
2. Use test data like: `STU12345` (student ID)
3. Scan with the app
4. Enter a test name
5. Save the record
6. Check Google Sheets - data should appear! (if online)

## Troubleshooting

### "Cannot save to database"
- Check if your Apps Script URL is correct (fully copied)
- Make sure you have internet connection
- Try using a different browser

### Data not appearing in Sheets
- If offline, your data is saved locally - don't worry!
- Click the **Sync** button when online
- Refresh your Google Sheet (press F5)
- Check if the script execution shows errors:
  - In Google Apps Script editor: **Executions** tab
  - Look for red error messages

### Permission Denied
- Make sure you deployed with **"Anyone"** access in the Apps Script
- If you get a permission error:
  - Go to Apps Script editor
  - Click **Deploy** → **Manage** (old version)
  - Remove old deployments
  - Create a new deployment with correct permissions

### Offline Status Not Updating
- Your data is safe! All records are stored locally
- Click **Sync** when you regain internet

## Data Structure

Your Google Sheet will look like:

| Timestamp | Student ID | Name | Course |
|-----------|-----------|------|--------|
| 4/16/2026, 10:30 AM | STU12345 | John Doe | IT |
| 4/16/2026, 10:32 AM | STU67890 | Jane Smith | BSBA |

## Security Notes

- This is a simple educational setup
- For production, add:
  - Authentication
  - Data validation
  - HTTPS
  - Rate limiting

## Support

Having issues? Check:
1. Google Apps Script deployed with "Anyone" access
2. Sheet has correct column headers in Row 1
3. Apps Script URL is fully copied and correct
4. Browser console (F12) for detailed error messages

---

**Ready to use!** Your app now works offline and syncs when online. Happy scanning! 📱✨
