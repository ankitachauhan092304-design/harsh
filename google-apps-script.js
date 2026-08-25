/**
 * Google Apps Script - Single Source of Truth Backend for Whitestone Fincorp CRM
 * 
 * Setup Instructions:
 * 1. Open Google Sheets (create a sheet named "Whitestone_CRM").
 * 2. Rename Sheet1 to "Leads".
 * 3. Go to Extensions -> Apps Script.
 * 4. Paste this complete code into Code.gs.
 * 5. Click Deploy -> New deployment -> Select type "Web app".
 * 6. Execute as: "Me", Who has access: "Anyone".
 * 7. Copy the Web App URL and set it in Web Settings or environment.
 */

const OWNER_EMAIL = 'info@whitestonefincorp.com';
const ADMIN_PORTAL_URL = 'https://www.whitestonefincorp.com/admin';

function getSpreadsheet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) return ss;
  } catch (e) {}
  
  try {
    var files = DriveApp.getFilesByName('Whitestone_CRM');
    if (files.hasNext()) {
      return SpreadsheetApp.openById(files.next().getId());
    }
  } catch (e) {}

  return SpreadsheetApp.create('Whitestone_CRM');
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'getLeads';
  
  if (action === 'getLeads') {
    return handleGetLeads();
  } else if (action === 'getVisitorAnalytics') {
    return handleGetVisitorAnalytics();
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', message: 'API active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    let contents = {};
    if (e && e.postData && e.postData.contents) {
      try {
        contents = JSON.parse(e.postData.contents);
      } catch (err) {
        contents = e.parameter || {};
      }
    } else if (e && e.parameter) {
      contents = e.parameter;
    }

    const action = contents.action || (e && e.parameter && e.parameter.action) || '';

    if (action === 'logVisitor' || contents.sessionId || (!contents.name && !contents.phone)) {
      return handleLogVisitor(contents);
    } else if (action === 'createLead') {
      return handleCreateLead(contents);
    } else if (action === 'updateLead') {
      return handleUpdateLead(contents);
    } else if (action === 'addNote') {
      return handleAddNote(contents);
    }

    return handleCreateLead(contents);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleCreateLead(data) {
  try {
    const name = (data.name || data.fullName || '').toString().trim();
    const phone = (data.phone || data.mobile || '').toString().trim();

    // Prevent blank visitor telemetry entries from populating the Leads tab
    if (!name && !phone) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'SKIPPED', message: 'Blank lead ignored' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('Leads');
    
    if (!sheet) {
      sheet = ss.insertSheet('Leads');
      sheet.appendRow([
        'ID', 'Lead Number', 'Name', 'Phone', 'Email', 'City',
        'Employment Type', 'Monthly Income', 'Loan Type', 'Loan Amount',
        'Status', 'Priority', 'Assigned Executive', 'Remarks', 'Source',
        'Notes JSON', 'Created At', 'Updated At'
      ]);
    }

    // Generate Reference Number
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const seq = String(Math.floor(Math.random() * 900000 + 100000));
    const leadNumber = `WF-${yyyy}${mm}${dd}-${seq}`;
    const leadId = `lead-${Date.now()}`;

    const row = [
      leadId,
      leadNumber,
      data.name || 'Anonymous',
      data.phone || '',
      data.email || '',
      data.city || '',
      data.employmentType || 'SALARIED',
      data.monthlyIncome || 0,
      (data.loanType || 'PERSONAL').toUpperCase(),
      Number(data.loanAmount) || 0,
      'NEW',
      'HIGH',
      'Unassigned',
      data.remarks || 'Website submission',
      data.source || 'WEBSITE_FORM',
      '[]',
      now.toISOString(),
      now.toISOString()
    ];

    sheet.appendRow(row);

    // Send Email Notification safely (catches missing MailApp permissions gracefully)
    sendOwnerNotification(leadNumber, data, now);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'SUCCESS',
      leadNumber: leadNumber,
      leadId: leadId,
      message: 'Lead created successfully'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'SUCCESS',
      leadNumber: `WF-${Date.now()}`,
      leadId: `lead-${Date.now()}`,
      notice: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleGetLeads() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Leads');
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', leads: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length < 2) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', leads: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const leads = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      let notes = [];
      try {
        notes = JSON.parse(row[15] || '[]');
      } catch (e) {}

      leads.push({
        id: String(row[0]),
        leadNumber: String(row[1]),
        name: String(row[2]),
        phone: String(row[3]),
        email: String(row[4]),
        city: String(row[5]),
        employmentType: String(row[6]),
        monthlyIncome: Number(row[7]) || 0,
        loanType: String(row[8]),
        loanAmount: Number(row[9]) || 0,
        status: String(row[10]),
        priority: String(row[11]),
        assignedTo: row[12] && row[12] !== 'Unassigned' ? { name: row[12] } : null,
        remarks: String(row[13]),
        source: String(row[14]),
        notes: notes,
        createdAt: String(row[16]),
        updatedAt: String(row[17])
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', leads: leads }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', leads: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleUpdateLead(data) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Leads');
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR' })).setMimeType(ContentService.MimeType.JSON);

    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === String(data.id)) {
        if (data.status) sheet.getRange(i + 1, 11).setValue(data.status);
        if (data.assignedToName) sheet.getRange(i + 1, 13).setValue(data.assignedToName);
        sheet.getRange(i + 1, 18).setValue(new Date().toISOString());
        break;
      }
    }
  } catch (e) {}

  return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAddNote(data) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Leads');
    if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR' })).setMimeType(ContentService.MimeType.JSON);

    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][0]) === String(data.leadId)) {
        let notes = [];
        try { notes = JSON.parse(values[i][15] || '[]'); } catch (e) {}
        notes.unshift({
          id: 'n-' + Date.now(),
          authorName: data.authorName || 'Admin',
          content: data.content || '',
          createdAt: new Date().toISOString()
        });
        sheet.getRange(i + 1, 16).setValue(JSON.stringify(notes));
        sheet.getRange(i + 1, 18).setValue(new Date().toISOString());
        break;
      }
    }
  } catch (e) {}

  return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendOwnerNotification(leadNumber, data, date) {
  try {
    const formattedAmount = data.loanAmount ? '₹' + Number(data.loanAmount).toLocaleString('en-IN') : 'N/A';
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0B4F9C; margin-top: 0;">🏢 New Lead Inquiry Received!</h2>
        <p style="font-size: 14px; color: #475569;">A new loan inquiry was submitted on Whitestone Fincorp website.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Lead Reference:</td><td style="padding: 10px; font-family: monospace; color: #0B4F9C; font-weight: bold; border: 1px solid #e2e8f0;">${leadNumber}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Customer Name:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${data.name || 'N/A'}</td></tr>
          <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Mobile Number:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">+91 ${data.phone || 'N/A'}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Email:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${data.email || 'N/A'}</td></tr>
          <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">City:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${data.city || 'N/A'}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Loan Category:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${data.loanType || 'PERSONAL'}</td></tr>
          <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Required Amount:</td><td style="padding: 10px; font-weight: bold; color: #00A86B; border: 1px solid #e2e8f0;">${formattedAmount}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Submitted Date:</td><td style="padding: 10px; border: 1px solid #e2e8f0;">${date.toLocaleString()}</td></tr>
        </table>

        <div style="text-align: center; margin-top: 25px;">
          <a href="${ADMIN_PORTAL_URL}" style="background-color: #0B4F9C; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Open Admin CRM Portal</a>
        </div>
      </div>
    `;

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: `NEW LEAD: ${data.name} - ${data.loanType} (${leadNumber})`,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log('Email send error: ' + err);
  }
}

function handleLogVisitor(data) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('Visitors');
    if (!sheet) {
      sheet = ss.insertSheet('Visitors');
      sheet.appendRow([
        'ID', 'Session ID', 'Timestamp', 'Path', 'Page Title',
        'Device', 'Browser', 'OS', 'Referrer', 'City', 'Region', 'Country', 'Location'
      ]);
    }

    const vlogId = 'vlog-' + Date.now();
    const city = data.city || 'Ahmedabad';
    const region = data.region || 'Gujarat';
    const country = data.country || 'India';
    const locationStr = data.location || (city + ', ' + region + ', ' + country);

    sheet.appendRow([
      vlogId,
      data.sessionId || 'sess-anon',
      new Date().toISOString(),
      data.path || '/',
      data.pageTitle || 'Whitestone Fincorp',
      data.device || 'DESKTOP',
      data.browser || 'Chrome',
      data.os || 'OS',
      data.referrer || 'Direct / Search',
      city,
      region,
      country,
      locationStr
    ]);
  } catch (err) {}

  return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGetVisitorAnalytics() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('Visitors');
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', visitors: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const values = sheet.getDataRange().getValues();
    const visitors = [];

    for (let i = values.length - 1; i >= 1 && visitors.length < 200; i--) {
      visitors.push({
        id: String(values[i][0]),
        sessionId: String(values[i][1]),
        timestamp: String(values[i][2]),
        path: String(values[i][3]),
        pageTitle: String(values[i][4]),
        device: String(values[i][5]),
        browser: String(values[i][6]),
        os: String(values[i][7]),
        referrer: String(values[i][8]),
        city: String(values[i][9] || 'Ahmedabad'),
        region: String(values[i][10] || 'Gujarat'),
        country: String(values[i][11] || 'India'),
        location: String(values[i][12] || (values[i][9] + ', ' + values[i][10] + ', ' + values[i][11]))
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', visitors: visitors }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
