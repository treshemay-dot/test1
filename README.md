# School ID Scanner App

A simple web app to scan QR codes/barcodes and save student IDs to Google Sheets by course.

## Features

- 📱 Camera-based QR/Barcode scanning
- 🎓 Course selection (HM, IT, BSBA, CS, ENG)
- 💾 Auto-save to Google Sheets database
- ✅ Success notifications
- 📱 Mobile-friendly responsive design
- Simple and minimal UI

## Setup Instructions

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Student Attendance"
3. Create columns with headers:
   - Column A: `Timestamp`
   - Column B: `Student ID`
   - Column C: `Course`

### Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Tools** → **Script Editor**
2. Delete any existing code and paste this:

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

3. Click **Deploy** → **New Deployment**
4. Select **Type**: Web app
5. Set **Execute as**: Your Google Account
6. Set **Who has access**: Anyone
7. Click **Deploy** and copy the deployment URL

### Step 3: Update the App

1. Open `script.js`
2. Find this line:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Apps Script URL
4. Save the file

### Step 4: Run the App

1. Open `index.html` in your browser
2. Allow camera access when prompted
3. Select a course
4. Click "Start Scan"
5. Point camera at the QR/Barcode
6. When scanned, click "Submit to Database"
7. You'll see a success notification!

## Usage

1. **Select Course**: Choose the student's course from dropdown
2. **Start Scan**: Click the button and point camera at QR/Barcode
3. **Submit**: Once scanned, click "Submit to Database" to save to Google Sheets
4. **Check Sheets**: Refresh your Google Sheet to see the new entry

## Browser Requirements

- Modern browser with camera support (Chrome, Firefox, Safari, Edge)
- Camera permissions enabled
- Internet connection (for Google Sheets integration)

## Mobile Usage

This app works great on mobile devices:
1. Open the HTML file on your phone
2. Allow camera access
3. Use your device's camera to scan

## Troubleshooting

### Camera not working
- Check browser permissions for camera access
- Try using HTTPS (required for production)
- Test on a different browser

### Data not saving to Google Sheets
- Verify the Apps Script URL is correct
- Check that the Apps Script is deployed publicly
- Open browser console (F12) to see error messages

### QR/Barcode not scanning
- Ensure good lighting
- Point camera steadily at the code
- Try from different angles

## Customization

### Add More Courses
1. Open `index.html`
2. Find the `<select id="course">` section
3. Add new options:
   ```html
   <option value="CODE">Course Name (CODE)</option>
   ```

### Change Colors
Edit `style.css` to modify:
- Background gradient colors
- Button colors
- Border colors

## Notes

- All data is sent to Google Sheets with timestamp
- Simple design for fast scanning workflow
- Works offline for scanning; needs internet to save to Sheets

---

**Ready to use!** Just update the Google Apps Script URL and you're good to go.
