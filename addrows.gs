function addrol() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Copy of Sheet1')
  var data = ss.getDataRange().getValues();
let offset = 1
  for (var x=1;x<data.length;x++){
Logger.log(data[x][5])
    if(data[x][5]===12){
      ss.insertRowsAfter(x+offset,4)


      offset += 4;

 

    }

  }

}
