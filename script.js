// ==================== OFFLINE DATABASE (IndexedDB) ====================
class OfflineDB {
    constructor() {
        this.dbName = 'StudentScannerDB';
        this.version = 1;
        this.storeName = 'records';
        this.db = null;
        this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;
                if (!this.db.objectStoreNames.contains(this.storeName)) {
                    const store = this.db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('synced', 'synced', { unique: false });
                }
            };
        });
    }

    async addRecord(data) {
        const store = this.db.transaction(this.storeName, 'readwrite').objectStore(this.storeName);
        return new Promise((resolve, reject) => {
            const request = store.add({ ...data, synced: false, createdAt: new Date().toISOString() });
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async getAllRecords() {
        const store = this.db.transaction(this.storeName, 'readonly').objectStore(this.storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        });
    }

    async getUnsyncedRecords() {
        const store = this.db.transaction(this.storeName, 'readonly').objectStore(this.storeName);
        const index = store.index('synced');
        return new Promise((resolve, reject) => {
            const request = index.getAll(false);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async markAsSynced(id) {
        const store = this.db.transaction(this.storeName, 'readwrite').objectStore(this.storeName);
        return new Promise((resolve, reject) => {
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const record = getRequest.result;
                record.synced = true;
                const updateRequest = store.put(record);
                updateRequest.onerror = () => reject(updateRequest.error);
                updateRequest.onsuccess = () => resolve();
            };
        });
    }

    async deleteRecord(id) {
        const store = this.db.transaction(this.storeName, 'readwrite').objectStore(this.storeName);
        return new Promise((resolve, reject) => {
            const request = store.delete(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    async deleteRecords(ids) {
        const store = this.db.transaction(this.storeName, 'readwrite').objectStore(this.storeName);
        return Promise.all(ids.map(id => {
            return new Promise((resolve, reject) => {
                const request = store.delete(id);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
            });
        }));
    }

    async clearAll() {
        const store = this.db.transaction(this.storeName, 'readwrite').objectStore(this.storeName);
        return new Promise((resolve, reject) => {
            const request = store.clear();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }
}

// ==================== INITIALIZATION ====================
const db = new OfflineDB();
let video = document.getElementById('cameraFeed');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let scanning = false;
let scannedId = null;

// Elements
const scanBtn = document.getElementById('scanBtn');
const stopBtn = document.getElementById('stopBtn');
const submitBtn = document.getElementById('submitBtn');
const clearScanBtn = document.getElementById('clearScanBtn');
const courseSelect = document.getElementById('course');
const message = document.getElementById('message');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const scannedDataDiv = document.getElementById('scannedData');
const studentIdSpan = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const courseDisplaySpan = document.getElementById('courseDisplay');
const syncBtn = document.getElementById('syncBtn');
const syncStatus = document.getElementById('syncStatus');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const selectAllBtn = document.getElementById('selectAllBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');

// Google Sheets Configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNIeBOonWRcp8wdlrsaYdtOpWB3ZZqcMnOZDuVsvmkg2fD_eonNUBy7Zxx7jc9ADhO/exec';

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));
        
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        if (tabId === 'data-tab') {
            loadDataTable();
        }
    });
});

// ==================== SCANNING ====================
scanBtn.addEventListener('click', startScanning);
stopBtn.addEventListener('click', stopScanning);
submitBtn.addEventListener('click', submitToDatabase);
clearScanBtn.addEventListener('click', clearScan);

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
        clearScanBtn.style.display = 'none';
        document.getElementById('cameraOverlay').style.display = 'flex';
        showMessage('🔍 Scanning... Point camera at QR/Barcode', 'info');
        
        scanQRCode();
    } catch (err) {
        showMessage('❌ Camera access denied. Check permissions.', 'error');
        console.error('Camera error:', err);
    }
}

function stopScanning() {
    scanning = false;
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    
    scanBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    document.getElementById('cameraOverlay').style.display = 'none';
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
            showNotification('✓ Scan Successful!');
            clearInterval(scanInterval);
        }
    }, 100);
}

function displayScannedData() {
    const course = courseSelect.value;
    studentIdSpan.value = scannedId;
    studentNameInput.value = '';
    courseDisplaySpan.value = courseSelect.options[courseSelect.selectedIndex].text;
    
    scannedDataDiv.style.display = 'block';
    submitBtn.style.display = 'block';
    clearScanBtn.style.display = 'block';
    studentNameInput.focus();
}

function clearScan() {
    scannedId = null;
    studentIdSpan.value = '';
    studentNameInput.value = '';
    courseDisplaySpan.value = '';
    scannedDataDiv.style.display = 'none';
    submitBtn.style.display = 'none';
    clearScanBtn.style.display = 'none';
    showMessage('', '');
}

// ==================== DATABASE SUBMISSION ====================
async function submitToDatabase() {
    if (!scannedId) {
        showMessage('❌ No data to submit', 'error');
        return;
    }

    const studentName = studentNameInput.value.trim();
    if (!studentName) {
        showMessage('❌ Please enter student name', 'error');
        return;
    }

    const course = courseSelect.value;
    const timestamp = new Date().toLocaleString();

    try {
        showMessage('💾 Saving record...', 'info');
        
        const recordData = {
            studentId: scannedId,
            name: studentName,
            course: course,
            timestamp: timestamp
        };

        // Save to IndexedDB (offline)
        const recordId = await db.addRecord(recordData);
        showNotification(`✓ Record Saved (ID: ${recordId})`);
        showMessage('✓ Record saved locally!', 'success');

        // Try to sync if online
        if (navigator.onLine) {
            await syncRecord(recordId, recordData);
        } else {
            updateSyncStatus('📶 Offline - Pending sync');
        }

        // Reset form
        setTimeout(() => {
            clearScan();
            loadDataTable();
        }, 1500);

    } catch (err) {
        showMessage('❌ Error saving record', 'error');
        console.error('Submit error:', err);
    }
}

// ==================== SYNC WITH GOOGLE SHEETS ====================
async function syncRecord(recordId, recordData) {
    try {
        const payload = {
            studentId: recordData.studentId,
            name: recordData.name,
            course: recordData.course,
            timestamp: recordData.timestamp
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        await db.markAsSynced(recordId);
        updateSyncStatus('✓ Synced');
    } catch (err) {
        console.error('Sync error:', err);
    }
}

async function syncAll() {
    if (!navigator.onLine) {
        showMessage('❌ No internet connection', 'error');
        return;
    }

    try {
        updateSyncStatus('🔄 Syncing...');
        showMessage('🔄 Syncing all records...', 'info');

        const unsyncedRecords = await db.getUnsyncedRecords();
        
        if (unsyncedRecords.length === 0) {
            showMessage('✓ All records already synced!', 'success');
            updateSyncStatus('✓ Synced');
            return;
        }

        let successCount = 0;
        for (const record of unsyncedRecords) {
            try {
                await syncRecord(record.id, {
                    studentId: record.studentId,
                    name: record.name,
                    course: record.course,
                    timestamp: record.timestamp
                });
                successCount++;
            } catch (err) {
                console.error('Failed to sync record:', record.id, err);
            }
        }

        showMessage(`✓ Synced ${successCount}/${unsyncedRecords.length} records`, 'success');
        updateSyncStatus('✓ Synced');
        loadDataTable();
    } catch (err) {
        showMessage('❌ Sync failed', 'error');
        console.error('Sync error:', err);
    }
}

syncBtn.addEventListener('click', syncAll);

// ==================== DATA TABLE ====================
async function loadDataTable() {
    try {
        const records = await db.getAllRecords();
        const tableBody = document.getElementById('tableBody');
        const recordCount = document.getElementById('recordCount');

        if (records.length === 0) {
            tableBody.innerHTML = '<tr class="empty-state"><td colspan="7">📭 No records yet. Start scanning!</td></tr>';
            recordCount.textContent = '0 records';
            selectAllBtn.style.display = 'none';
            deleteSelectedBtn.style.display = 'none';
            return;
        }

        tableBody.innerHTML = records.map(record => `
            <tr data-id="${record.id}">
                <td class="col-select">
                    <input type="checkbox" class="row-checkbox" data-id="${record.id}">
                </td>
                <td>${new Date(record.createdAt).toLocaleString()}</td>
                <td><strong>${record.studentId}</strong></td>
                <td>${record.name}</td>
                <td>${record.course}</td>
                <td class="status-${record.synced ? 'synced' : 'pending'}">
                    ${record.synced ? '✓ Synced' : '⏳ Pending'}
                </td>
                <td class="col-action">
                    <button class="btn-delete" data-id="${record.id}" title="Delete this record">🗑</button>
                </td>
            </tr>
        `).join('');

        recordCount.textContent = `${records.length} record${records.length !== 1 ? 's' : ''}`;
        selectAllBtn.style.display = 'inline-block';

        // Add row delete listeners
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                deleteRecord(id);
            });
        });

        // Add checkbox listeners
        document.querySelectorAll('.row-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateCheckboxState);
        });

        selectAllCheckbox.addEventListener('change', () => {
            const isChecked = selectAllCheckbox.checked;
            document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = isChecked);
            updateCheckboxState();
        });

    } catch (err) {
        console.error('Error loading data table:', err);
    }
}

function updateCheckboxState() {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const selectedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (selectedCount > 0) {
        deleteSelectedBtn.style.display = 'inline-block';
    } else {
        deleteSelectedBtn.style.display = 'none';
    }

    selectAllCheckbox.checked = selectedCount === checkboxes.length && checkboxes.length > 0;
}

async function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        try {
            await db.deleteRecord(id);
            showNotification('✓ Record deleted');
            loadDataTable();
        } catch (err) {
            showMessage('❌ Error deleting record', 'error');
            console.error('Delete error:', err);
        }
    }
}

async function deleteSelected() {
    const selectedIds = Array.from(document.querySelectorAll('.row-checkbox:checked'))
        .map(cb => parseInt(cb.getAttribute('data-id')));

    if (selectedIds.length === 0) {
        showMessage('❌ No records selected', 'error');
        return;
    }

    if (confirm(`Delete ${selectedIds.length} record${selectedIds.length !== 1 ? 's' : ''}? This cannot be undone.`)) {
        try {
            await db.deleteRecords(selectedIds);
            showNotification(`✓ ${selectedIds.length} record${selectedIds.length !== 1 ? 's' : ''} deleted`);
            loadDataTable();
            selectAllCheckbox.checked = false;
            deleteSelectedBtn.style.display = 'none';
        } catch (err) {
            showMessage('❌ Error deleting records', 'error');
            console.error('Delete error:', err);
        }
    }
}

async function clearAllRecords() {
    if (confirm('⚠️ Delete ALL records? This cannot be undone!')) {
        try {
            await db.clearAll();
            showNotification('✓ All records cleared');
            loadDataTable();
            selectAllCheckbox.checked = false;
        } catch (err) {
            showMessage('❌ Error clearing records', 'error');
            console.error('Clear error:', err);
        }
    }
}

deleteSelectedBtn.addEventListener('click', deleteSelected);
clearAllBtn.addEventListener('click', clearAllRecords);
selectAllBtn.addEventListener('click', () => {
    selectAllCheckbox.checked = !selectAllCheckbox.checked;
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = selectAllCheckbox.checked);
    updateCheckboxState();
});

// ==================== UI HELPERS ====================
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

function updateSyncStatus(status) {
    syncStatus.textContent = status;
}

// ==================== NETWORK STATUS ====================
window.addEventListener('online', () => {
    updateSyncStatus('✓ Online - Ready to sync');
    showMessage('✓ Back online!', 'success');
});

window.addEventListener('offline', () => {
    updateSyncStatus('📶 Offline mode');
    showMessage('📶 Offline - Changes saved locally', 'warning');
});

// ==================== INITIALIZATION ====================
async function initialize() {
    await db.init();
    updateSyncStatus(navigator.onLine ? '✓ Ready' : '📶 Offline');
    loadDataTable();
    showMessage('👋 Ready to scan! Select a course to begin.', 'info');
}

initialize();

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
