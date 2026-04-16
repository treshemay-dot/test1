let video = document.getElementById('cameraFeed');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let scanning = false;
let scannedId = null;

// Elements
const scanBtn = document.getElementById('scanBtn');
const stopBtn = document.getElementById('stopBtn');
const submitBtn = document.getElementById('submitBtn');
const courseSelect = document.getElementById('course');
const message = document.getElementById('message');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const scannedDataDiv = document.getElementById('scannedData');
const studentIdSpan = document.getElementById('studentId');
const courseDisplaySpan = document.getElementById('courseDisplay');

// Google Sheets Configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNIeBOonWRcp8wdlrsaYdtOpWB3ZZqcMnOZDuVsvmkg2fD_eonNUBy7Zxx7jc9ADhO/exec'; // Replace with your Apps Script URL

// Start Scanning
scanBtn.addEventListener('click', startScanning);
stopBtn.addEventListener('click', stopScanning);
submitBtn.addEventListener('click', submitToSheets);

async function startScanning() {
    const course = courseSelect.value;
    
    if (!course) {
        showMessage('Please select a course first', 'error');
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        video.srcObject = stream;
        scanning = true;
        
        scanBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        scannedDataDiv.style.display = 'none';
        submitBtn.style.display = 'none';
        showMessage('Scanning... Point camera at QR/Barcode', 'success');
        
        // Scan QR/Barcode
        scanQRCode();
    } catch (err) {
        showMessage('Cannot access camera. Check permissions.', 'error');
        console.error('Camera error:', err);
    }
}

function stopScanning() {
    scanning = false;
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    
    scanBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    showMessage('', '');
}

function scanQRCode() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const scanInterval = setInterval(() => {
        if (!scanning) {
            clearInterval(scanInterval);
            return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height, {
            inversionAttempts: "dontInvert"
        });

        if (code) {
            scannedId = code.data;
            stopScanning();
            displayScannedData();
            showNotification('Scan Successful!');
            clearInterval(scanInterval);
        }
    }, 100);
}

function displayScannedData() {
    const course = courseSelect.value;
    studentIdSpan.textContent = scannedId;
    courseDisplaySpan.textContent = courseSelect.options[courseSelect.selectedIndex].text;
    
    scannedDataDiv.style.display = 'block';
    submitBtn.style.display = 'block';
}

function showNotification(text) {
    notificationText.textContent = text;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = 'message ' + type;
}

async function submitToSheets() {
    if (!scannedId) {
        showMessage('No data to submit', 'error');
        return;
    }

    const course = courseSelect.value;
    const timestamp = new Date().toLocaleString();

    try {
        showMessage('Submitting...', '');
        
        const payload = {
            studentId: scannedId,
            course: course,
            timestamp: timestamp
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        showMessage('Data saved to database!', 'success');
        showNotification('✓ Successfully Saved!');
        
        // Reset form
        setTimeout(() => {
            scannedDataDiv.style.display = 'none';
            submitBtn.style.display = 'none';
            scannedId = null;
            courseSelect.value = '';
            showMessage('', '');
            scanBtn.style.display = 'block';
        }, 2000);

    } catch (err) {
        showMessage('Error saving data. Check console.', 'error');
        console.error('Submit error:', err);
    }
}

// Initial message
showMessage('Select a course and click Start Scan', '');

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  });
}

// PWA Installation Prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // You can show an "Install App" button here if desired
  console.log('PWA installation available');
});

window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  deferredPrompt = null;
});
