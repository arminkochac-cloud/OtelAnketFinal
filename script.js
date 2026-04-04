function doGet(e) {
  try {
    var ss = SpreadsheetApp.openById(
      '1P3UY9PEFN8csOUPjWMKZHJRhqReLPajZfLdg7jJQ54k'
    );
    var sheet = ss.getSheets()[0];

    // ✅ Eğer data parametresi varsa YAZ
    if (e && e.parameter && e.parameter.data) {

      var raw = decodeURIComponent(e.parameter.data);
      var data = JSON.parse(raw);

      sheet.appendRow([
        data.date || new Date().toLocaleString('tr-TR'),
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

      return ContentService.createTextOutput(
        JSON.stringify({ status: 'success' })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // ✅ Eğer parametre yoksa → TÜM VERİYİ DÖN
    var data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return ContentService.createTextOutput(
        JSON.stringify([])
      ).setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var result = [];

    for (var i = 1; i < data.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      result.push(row);
    }

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
  return doGet(e);
}
