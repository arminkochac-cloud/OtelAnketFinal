// ============================================================================
// CONCORDIA CELES HOTEL - APPS SCRIPT BACKEND
// FINAL CLEAN VERSION
// - Form data alır
// - Google Sheets'e yazar
// - Tüm veriyi JSON olarak döner
// ============================================================================

var SPREADSHEET_ID = '1P3UY9PEFN8csOUPjWMKZHJRhqReLPajZfLdg7jJQ54k';

// Sheet kolon sırası
var HEADERS = [
  'tarih',
  'fullName',
  'gender',
  'nationality',
  'roomNumber',
  'checkIn',
  'checkOut',
  'email',
  'welcomeGreeting',
  'checkInProcess',
  'facilityInfo',
  'frontDeskCare',
  'bellboyService',
  'grWelcomeQuality',
  'problemSolving',
  'guestFollowUp',
  'initialRoomCleaning',
  'roomAppearance',
  'dailyRoomCleaning',
  'minibarService',
  'publicAreaCleaning',
  'beachPoolCleaning',
  'housekeepingStaffCare',
  'breakfastVariety',
  'breakfastQuality',
  'lunchVariety',
  'lunchQuality',
  'dinnerVariety',
  'dinnerQuality',
  'alacarteQuality',
  'kitchenHygiene',
  'foodStaffCare',
  'poolBarQuality',
  'lobbyBarQuality',
  'snackBarQuality',
  'drinkQuality',
  'barHygiene',
  'barStaffCare',
  'restaurantLayout',
  'restaurantCapacity',
  'restaurantHygiene',
  'snackbarRestaurant',
  'alacarteRestaurant',
  'restaurantStaffCare',
  'roomTechnicalSystems',
  'maintenanceResponse',
  'environmentLighting',
  'poolWaterCleaning',
  'technicalStaffCare',
  'daytimeActivities',
  'sportsAreas',
  'eveningShows',
  'miniclubActivities',
  'entertainmentStaffCare',
  'landscaping',
  'spaServices',
  'shopBehavior',
  'priceQuality',
  'previousStay',
  'praisedStaff',
  'generalComments',
  'willReturn',
  'wouldRecommend'
];

// ---------------------------------------------------------------------------
// ENTRY POINTS
// ---------------------------------------------------------------------------
function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0];
    ensureHeaders_(sheet);

    // Eğer data parametresi varsa YAZ
    if (e && e.parameter && e.parameter.data) {
      var raw = decodeURIComponent(e.parameter.data);
      var data = JSON.parse(raw);

      appendSurveyRow_(sheet, data);

      return ContentService.createTextOutput(
        JSON.stringify({ status: 'success' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Eğer parametre yoksa → TÜM VERİYİ DÖN
    var result = readAllData_(sheet);

    return ContentService.createTextOutput(
      JSON.stringify(result)
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: err.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheets()[0];
    ensureHeaders_(sheet);

    var data = getPayload_(e);
    if (!data) {
      throw new Error('Gönderilecek veri bulunamadı');
    }

    data = parsePayload_(data);
    appendSurveyRow_(sheet, data);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: err.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function ensureHeaders_(sheet) {
  // Sheet boşsa başlıkları yaz
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    return;
  }

  // İlk satır boşsa yine başlıkları yaz
  var firstRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  var firstCell = firstRow[0];

  if (!firstCell) {
    sheet.clear();
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
}

function getPayload_(e) {
  if (!e) return null;

  // GET: ?data=...
  if (e.parameter && e.parameter.data) {
    return e.parameter.data;
  }

  // POST: body içerik
  if (e.postData && e.postData.contents) {
    var contents = e.postData.contents;

    // urlencoded form gibi geldiyse: data=....
    if (contents.indexOf('data=') === 0 || contents.indexOf('&') > -1) {
      var obj = {};
      var parts = contents.split('&');

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var idx = p.indexOf('=');
        if (idx > -1) {
          var key = decodeURIComponent(p.substring(0, idx));
          var val = decodeURIComponent(p.substring(idx + 1));
          obj[key] = val;
        }
      }

      if (obj.data) return obj.data;
      return null;
    }

    // Düz JSON gelirse
    return contents;
  }

  return null;
}

function parsePayload_(payload) {
  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload);
    } catch (err) {
      try {
        return JSON.parse(decodeURIComponent(payload));
      } catch (err2) {
        throw new Error('JSON parse edilemedi');
      }
    }
  }

  if (typeof payload === 'object') {
    return payload;
  }

  throw new Error('Geçersiz payload');
}

function appendSurveyRow_(sheet, data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    sheet.appendRow([
      data.tarih || data.date || new Date().toLocaleString('tr-TR'),
      data.fullName || '',
      data.gender || '',
      data.nationality || '',
      data.roomNumber || '',
      data.checkIn || '',
      data.checkOut || '',
      data.email || '',
      data.welcomeGreeting || '',
      data.checkInProcess || '',
      data.facilityInfo || '',
      data.frontDeskCare || '',
      data.bellboyService || '',
      data.grWelcomeQuality || '',
      data.problemSolving || '',
      data.guestFollowUp || '',
      data.initialRoomCleaning || '',
      data.roomAppearance || '',
      data.dailyRoomCleaning || '',
      data.minibarService || '',
      data.publicAreaCleaning || '',
      data.beachPoolCleaning || '',
      data.housekeepingStaffCare || '',
      data.breakfastVariety || '',
      data.breakfastQuality || '',
      data.lunchVariety || '',
      data.lunchQuality || '',
      data.dinnerVariety || '',
      data.dinnerQuality || '',
      data.alacarteQuality || '',
      data.kitchenHygiene || '',
      data.foodStaffCare || '',
      data.poolBarQuality || '',
      data.lobbyBarQuality || '',
      data.snackBarQuality || '',
      data.drinkQuality || '',
      data.barHygiene || '',
      data.barStaffCare || '',
      data.restaurantLayout || '',
      data.restaurantCapacity || '',
      data.restaurantHygiene || '',
      data.snackbarRestaurant || '',
      data.alacarteRestaurant || '',
      data.restaurantStaffCare || '',
      data.roomTechnicalSystems || '',
      data.maintenanceResponse || '',
      data.environmentLighting || '',
      data.poolWaterCleaning || '',
      data.technicalStaffCare || '',
      data.daytimeActivities || '',
      data.sportsAreas || '',
      data.eveningShows || '',
      data.miniclubActivities || '',
      data.entertainmentStaffCare || '',
      data.landscaping || '',
      data.spaServices || '',
      data.shopBehavior || '',
      data.priceQuality || '',
      data.previousStay || '',
      data.praisedStaff || '',
      data.generalComments || '',
      data.willReturn || '',
      data.wouldRecommend || ''
    ]);
  } finally {
    lock.releaseLock();
  }
}

function readAllData_(sheet) {
  var data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return [];
  }

  var headers = data[0];
  var result = [];

  for (var i = 1; i < data.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[String(headers[j])] = data[i][j];
    }
    result.push(row);
  }

  return result;
}
