# Google Apps Script — Setup Guide

## Step-by-Step Setup (5 minutes)

### 1. Open Google Apps Script
Go to: https://script.google.com → Click **New Project**

### 2. Paste the Code
- Delete the default `function myFunction() {}` 
- Copy everything from `Code.gs` and paste it in

### 3. Link Your Google Sheet
- In the same Google Apps Script project, click **Resources → Advanced Google Services** (or just save — it auto-uses the attached spreadsheet)
- Go to **Extensions → Apps Script** from any Google Sheet you want to use
- **OR:** Create a new Google Sheet, then go to Extensions → Apps Script and paste the code there

### 4. Deploy as Web App
1. Click **Deploy** → **New Deployment**
2. Select type: **Web App**
3. Description: `Whitestone Fincorp Lead API`
4. Execute as: **Me**
5. Who has access: **Anyone**
6. Click **Deploy** → Copy the **Web App URL**

### 5. Update the form script
Open the file:
```
out/_next/static/chunks/wf-form.js
```

Find this line:
```javascript
var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPLACEHOLDER/exec';
```

Replace `AKfycbxPLACEHOLDER` with your actual deployment ID from step 4.

### 6. Re-zip and re-host
Run:
```bash
cd /Users/harshparmar/Downloads/WhitestoneFintech
rm -f /Users/harshparmar/Downloads/WhitestoneFintech-Static.zip
zip -r /Users/harshparmar/Downloads/WhitestoneFintech-Static.zip out/ google-app-script/
```

---

## What Gets Saved to Google Sheets

Each form submission saves a row with:

| Column | Data |
|--------|------|
| Timestamp | Date & time of submission |
| Lead Ref | Unique ID e.g. WF-20250716-123456 |
| Full Name | Customer's name |
| Phone | 10-digit mobile number |
| Email | Email (optional) |
| City | City entered |
| Loan Type | Personal Loan / Business Loan / etc. |
| Loan Amount (₹) | Amount requested |
| Remarks | Special requirements |
| Source | WEBSITE_FORM |
| Page | Which page they submitted from |
| UTC Timestamp | ISO timestamp |

---

## WhatsApp Number
The WhatsApp number is hardcoded as **+91 98249 75488** in:
```
out/_next/static/chunks/wf-form.js  (line 7: WA_NUMBER)
```
To change it, update that variable and re-zip.
