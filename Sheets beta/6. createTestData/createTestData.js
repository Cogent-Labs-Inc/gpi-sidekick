function createTestData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var data = [
    ["ID", "column heading"],
    ["name of id", "value"],
  ];

  var range = sheet.getRange(1, 1, data.length, data[0].length);
  range.setValues(data);
}
