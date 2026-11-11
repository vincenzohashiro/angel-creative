// Angel Creative — Sheet Writer
// Deploy this as a Google Apps Script Web App:
//   Extensions → Apps Script → paste this → Deploy → New deployment
//   Type: Web app | Execute as: Me | Who has access: Anyone
//   Copy the web app URL → paste into Call Log ⚙ settings

var SECRET   = 'ac2025'   // Change to anything you want; paste same value in dashboard settings
var SHEET_ID = '1WAoCru7WQU2SPHRycz1CZvmO-JifIkMHuw6Lr6r3ilw'
var TAB_NAME = 'Sheet1'

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)
    if (data.secret !== SECRET) return reply('unauthorized')

    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB_NAME)

    if (data.action === 'append') {
      sheet.appendRow([
        data.date,
        data.buyer,
        data.callerId,
        data.reason,
        data.vendor,
        data.reportingUpdated ? 'Yes' : 'No',
        data.vendorAlerted    ? 'Yes' : 'No'
      ])

    } else if (data.action === 'update') {
      var values = sheet.getDataRange().getValues()
      for (var i = 1; i < values.length; i++) {
        if (String(values[i][2]).trim() === String(data.callerId).trim()) {
          if (data.reportingUpdated !== undefined)
            sheet.getRange(i + 1, 6).setValue(data.reportingUpdated ? 'Yes' : 'No')
          if (data.vendorAlerted !== undefined)
            sheet.getRange(i + 1, 7).setValue(data.vendorAlerted ? 'Yes' : 'No')
          break
        }
      }
    }

    return reply('ok')
  } catch (err) {
    return reply('error: ' + err.message)
  }
}

function reply(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, msg: msg }))
    .setMimeType(ContentService.MimeType.JSON)
}
