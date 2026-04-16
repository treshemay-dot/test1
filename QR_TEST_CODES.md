# QR Code Testing Guide

Use this guide to test the scanner before using with real student IDs.

## Online QR Code Generators

### Free Tools
1. **QR Code Generator**: https://www.qr-code-generator.com/
2. **QR Server**: https://goQR.me/
3. **QR Code Monkey**: https://www.qrcode-monkey.com/

## Test Data Examples

Use these ID formats to test:

```
STU001
STU002
STU20240411001
ID-HM-2024-001
IT-STUDENT-123
BSBA-2024-456
```

## Generate a Test QR Code

1. Go to: https://www.qr-code-generator.com/
2. Select **Free Text** or **URL**
3. Enter test data: `STU001`
4. Click **Generate**
5. Download or screenshot the QR code
6. Test with the app:
   - Open `index.html`
   - Click "Start Scan"
   - Point camera at printed/displayed QR code
   - Scanner should detect and decode it

## Alternative: Use These Test Steps

### Without Printing

1. Generate QR code online
2. Display on another device/screen
3. Scan with your phone/webcam running the app

### With Mobile Phone

1. Generate QR code
2. Open image on one phone
3. Run app on another phone
4. Scan the image

## Common Test Scenarios

### Scenario 1: Quick Test
```
Data: TEST123
Course: IT
Expected: Student ID shows "TEST123", Course shows "Information Technology (IT)"
```

### Scenario 2: Long ID
```
Data: STU-2024-04-11-001-HM
Course: HM
Expected: Full string captured and displayed
```

### Scenario 3: Multiple Quick Scans
```
1. Scan STU001 - Submit - Reset
2. Scan STU002 - Submit - Reset
Expected: Each saves independently to Google Sheets
```

## Testing Checklist

- [ ] Camera opens successfully
- [ ] QR code is detected
- [ ] Text is displayed correctly
- [ ] Course is properly selected
- [ ] Success notification appears
- [ ] Data appears in Google Sheet
- [ ] Form resets after submission
- [ ] Can scan multiple times in sequence
- [ ] Works on mobile browser

## Troubleshooting Tests

### QR Code Not Scanning?

1. **Try different lighting**: Good lighting = better scanning
2. **Try different distances**: 10-30cm optimal
3. **Steady the camera**: Use phone holder or rest on table
4. **Clean camera lens**: Dust affects scanning
5. **Try a different QR code**: Generate a new one

### Debug Mode

Open browser console (F12 → Console tab) to see:

```javascript
// Check if QR library is loaded
console.log(jsQR);

// Check camera access
navigator.mediaDevices.getUserMedia({video: true})
  .then(stream => console.log("Camera OK"))
  .catch(err => console.error("Camera Error:", err));
```

## Sample Test QR Codes

Because QR codes are visual, here are names for codes to generate:

| ID | Course | Description |
|----|--------|-------------|
| STU2024001 | IT | Standard format |
| SCHOOL-ID-001 | HM | Detailed format |
| 12345 | BSBA | Numeric only |
| ABC-2024-04 | CS | Alphanumeric |
| ATTEND001 | ENG | Attendance format |

## Video Testing

1. Record yourself scanning a QR code
2. Play video on one screen
3. Point phone camera at video
4. Scanner should still detect from video playback

## Performance Test

Time your scanning:
- Fast scans: < 2 seconds
- Standard scans: 2-5 seconds
- Slow scans: > 5 seconds

If consistently slow, check:
- Browser performance (close other tabs)
- Camera resolution
- Device processing power

## Real-World Testing Tips

1. **Print QR codes**: Use student ID cards or badges
2. **Barcode compatibility**: Standard barcodes also work
3. **Batch testing**: Scan 10+ students to verify data collection
4. **Multi-course**: Test each course works correctly
5. **Mobile testing**: Test on actual phones, not just desktop

---

Done testing? Your app is ready for production scanning!

Generate real student ID QR codes and start scanning. ✅
