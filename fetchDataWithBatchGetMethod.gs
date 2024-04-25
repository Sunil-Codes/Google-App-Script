function fetchDataAndProcessJSON() {
  var spreadsheetId = '1q-4B1UpeHe4jNwEkSVrHs_1qpV3i3H-tNIJT3B50eMw'; // Replace with your actual Spreadsheet ID
  var ranges = ['FMS Database!A:H']; // Define the range you want to fetch

  // Fetch data from Google Sheets
  var response = Sheets.Spreadsheets.Values.batchGet(spreadsheetId, { ranges: ranges });
  var batchData = response.valueRanges;

  // Check if data was retrieved
  if (batchData.length > 0) {
    var rows = batchData[0].values;

    // Normalize rows to fill in missing cells with null or empty string
    var maxColumns = 8; // Assuming 8 columns (A to H)
    var normalizedRows = rows.map(row => {
      // Fill in the missing cells with null or an empty string
      while (row.length < maxColumns) {
        row.push(null);
      }
      return row;
    });

    // Filter and sort data
    var filteredData = normalizedRows.filter(function(row) {
      var cValue = row[2]; // Column C values
      var fValue = row[5] ? new Date(row[5]) : null; // Column F values, check if exists and convert to Date
      return cValue != null && fValue >= new Date('2024-01-01');
    });

    // Sort the filtered data by Column F (index 5)
    filteredData.sort(function(a, b) {
      var dateA = new Date(a[5]);
      var dateB = new Date(b[5]);
      return dateA - dateB;
    });

    SpreadsheetApp.getActiveSheet().getRange(1,1,filteredData.length,8).setValues(filteredData)
    return filteredData;
  } else {
    Logger.log('No data returned from the API.');
    return [];
  }
}