const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Guests';

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Wedding RSVP API is running'
  });
}

function doPost(e) {
  try {
    const guestName = sanitizeName_(e && e.parameter && e.parameter.guestName);
    const guestCount = sanitizeCount_(e && e.parameter && e.parameter.guestCount);

    if (!guestName) {
      return jsonResponse_({ ok: false, error: 'Guest name is required' });
    }

    if (!guestCount) {
      return jsonResponse_({ ok: false, error: 'Guest count is required' });
    }

    const sheet = getSheet_();
    ensureHeader_(sheet);

    sheet.appendRow([
      guestName,
      guestCount,
      new Date(),
      'web-form'
    ]);

    SpreadsheetApp.flush();

    return jsonResponse_({
      ok: true,
      message: 'Saved',
      guestName: guestName,
      guestCount: guestCount
    });
  } catch (err) {
    return jsonResponse_({ ok: false, error: err.message });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Sheet "' + SHEET_NAME + '" not found');
  }
  return sheet;
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;

  sheet.getRange(1, 1, 1, 4).setValues([[
    'guest_name',
    'guest_count',
    'submitted_at',
    'source'
  ]]);
}

function sanitizeName_(value) {
  return String(value == null ? '' : value).trim();
}

function sanitizeCount_(value) {
  const normalized = String(value == null ? '' : value).trim();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) return null;

  const safe = Math.max(1, Math.min(20, Math.round(parsed)));
  return safe;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
