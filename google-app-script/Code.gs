/**
 * Google Apps Script — Whitestone Fincorp Lead Capture
 * ─────────────────────────────────────────────────────
 * HOW TO DEPLOY:
 * 1. Go to https://script.google.com → New Project
 * 2. Paste this entire file
 * 3. Click "Deploy" → "New Deployment"
 * 4. Type: "Web App", Execute as: "Me", Who has access: "Anyone"
 * 5. Copy the Web App URL
 * 6. Paste it in out/_next/static/chunks/wf-form.js → GOOGLE_SCRIPT_URL variable
 * 7. Re-zip the out/ folder and re-host
 */

var SHEET_NAME = 'Leads';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    var row = [
      new Date().toLocaleString('en-IN'),
      data.leadRef || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.city || '',
      data.loanType || '',
      data.loanAmount || '',
      data.message || '',
      data.source || 'WEBSITE_FORM',
      data.page || '/',
      data.timestamp || new Date().toISOString(),
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', leadRef: data.leadRef }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Whitestone Fincorp Lead API is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers
    var headers = [
      'Timestamp', 'Lead Ref', 'Full Name', 'Phone', 'Email',
      'City', 'Loan Type', 'Loan Amount (₹)', 'Remarks',
      'Source', 'Page', 'UTC Timestamp'
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}
