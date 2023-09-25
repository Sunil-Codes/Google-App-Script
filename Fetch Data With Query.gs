function getdata() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Data')   //type your sheet name where data will be pasted
  ss.getRange(2, 1, ss.getLastRow(),7).clearContent()  // set your rows and column accordingly


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
              

             value = convertStringToDate(data.table.rows[x].c[index].v) }  // created a function to convert this into date
          else 
          { value = data.table.rows[x].c[index].v }
          
       
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











