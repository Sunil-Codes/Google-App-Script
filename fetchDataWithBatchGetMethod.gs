function fetchDataAndProcessJSON() {
  var spreadsheetId = '1I8LJojaxFp_5n_3pDuuAw9O5xG-38TzNF8JNFrKMIsk'; // Replace with your actual Spreadsheet ID
  var ranges = ['FMS Database!A:H']; // Define the range you want to fetch

  // Fetch data from Google Sheets
  var response = Sheets.Spreadsheets.Values.batchGet(spreadsheetId, { ranges: ranges });
  var batchData = response.valueRanges;

  // Check if data was retrieved
  if (batchData.length > 0) {
    var data = batchData[0].values;

    // Filter data: Keep rows where Column C (index 2) is not null and Column F (index 5) is on or after Jan 1, 2024
    var filteredData = data.filter(function(row) {
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

    Logger.log(filteredData);
    return filteredData;
  } else {
    Logger.log('No data returned from the API.');
    return [];
  }
}