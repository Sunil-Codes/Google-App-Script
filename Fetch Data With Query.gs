function getdata() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Data')   //type your sheet name where data will be pasted
  ss.getRange(2, 1, ss.getLastRow(), 7).clearContent()  // set your rows and column accordingly


  SpreadsheetApp.flush()  // just to hold the it for some time.

  var holder = []  // here are data will be added in this array.

  var myQuery = "SELECT * WHERE C is not null and F>=date'2023-05-01' order by F"   // you can customize this query according to you.

  var data = method3('1860tRMh9XcZ3jWsdAB8uvEtXVFqauoeROCzU-BidRtI', 'MIS DATA', 'B', 'H', myQuery) // (sheetID,SheetName,colstart,ColEnd,Query)

  // ----------------------------
  // running a loop for adding the data in holder

  var col = data.table.cols    //getting columns from json data
  var row = data.table.rows  //getting rows from json data

  if (data.table.rows.length > 0) {

    for (var x = 0; x < row.length; x++) {
      var rows = []
      col.forEach(function (item, index) {
        var value;
        // Logger.log(index)
        try {                                         // trying this if this throws error it will make the value blank.
          if (index === 4 || index === 5) {           // here just for col 4 and 5  I am converting strings into date. 


            value = convertStringToDate(data.table.rows[x].c[index].v)
          }  // created a function to convert this into date
          else { value = data.table.rows[x].c[index].v }

        } catch (e) {
          value = ''
        }

        rows.push(value)
      })

      holder.push(rows)
      rows = []

    }
  }


  ss.getRange(2, 1, holder.length, 7).setValues(holder)   //change you rows and col here and pasing data now.
}


function convertStringToDate(dateString) {
  // var dateString = "Date(2023,1,16,14,48,6)";

  // Extract date and time values from the string
  var dateValues = dateString.match(/\d+/g);

  if (dateValues && dateValues.length >= 6) {
    // Create a Date object using the extracted values
    var year = parseInt(dateValues[0]);
    var month = parseInt(dateValues[1]); // Adjust for zero-based month
    var day = parseInt(dateValues[2]);
    var hours = parseInt(dateValues[3]);
    var minutes = parseInt(dateValues[4]);
    var seconds = parseInt(dateValues[5]);

    var date = new Date(year, month, day, hours, minutes, seconds);


    return date
  }
}





function method3(spreadsheetID, sheetName, queryColumnLetterStart, queryColumnLetterEnd, myQuery) {
  // SQL like query
  // myQuery = "SELECT * WHERE " + queryColumnLetterSearch + " = '" + query + "' order by E ";

  // the query URL
  // don't provide last row in range selection
  var qvizURL = 'https://docs.google.com/spreadsheets/d/' + spreadsheetID + '/gviz/tq?tqx=out:json&headers=1&sheet=' + sheetName + '&range=' + queryColumnLetterStart + ":" + queryColumnLetterEnd + '&tq=' + encodeURIComponent(myQuery);

  // fetch the data
  var ret = UrlFetchApp.fetch(qvizURL, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } }).getContentText();

  // remove some crap from the return string
  return JSON.parse(ret.replace("/*O_o*/", "").replace("google.visualization.Query.setResponse(", "").slice(0, -2));
}




