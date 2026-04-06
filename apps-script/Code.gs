const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Guests';

function doGet(e) {
  return ContentService
    .createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const token = normalize_(e && e.parameter && e.parameter.token);
    const answer = normalize_(e && e.parameter && e.parameter.answer);

    if (!token) {
      return textResponse_('Missing token');
    }

    if (answer !== 'YES') {
      return textResponse_('Unsupported answer');
    }

    const sheet = getSheet_();
    const row = findRowByToken_(sheet, token);

    if (!row) {
      return textResponse_('Token not found: ' + token);
    }

    const status = normalize_(sheet.getRange(row, 3).getDisplayValue());

    if (status === 'YES') {
      return textResponse_('Already confirmed');
    }

    sheet.getRange(row, 3).setValue('YES');
    sheet.getRange(row, 4).setValue(new Date());
    SpreadsheetApp.flush();

    return textResponse_('Saved');
  } catch (err) {
    return textResponse_('Error: ' + err.message);
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

function findRowByToken_(sheet, token) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const values = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();

  for (let i = 0; i < values.length; i++) {
    const current = normalize_(values[i][0]);
    if (current === token) {
      return i + 2;
    }
  }

  return null;
}

function normalize_(value) {
  return String(value == null ? '' : value).trim().toUpperCase();
}

function textResponse_(text) {
  return ContentService
    .createTextOutput(text)
    .setMimeType(ContentService.MimeType.TEXT);
}
