
function YourFuncitonName() {
  var spreadsheetUrl = 'Your sheet URL form where the data will come'
  var sSheet = 'source Sheet name'  //source sheet
   var destinationSheet ='sheet name where data will be pasted' //the data will be pasted here in this sheet

   var range = 'a1:b'    //  this is the range which will be copied and pasted
    ImportSheetData(spreadsheetUrl,sSheet,destinationSheet,range)

}




function ImportSheetData(spreadsheetUrl, sSheet, destinationSheet, range) {

  var desSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(destinationSheet)
  var lrowData = SpreadsheetApp.openByUrl(spreadsheetUrl).getSheetByName(sSheet)
  var deslrow = desSheet.getLastRow()
  var deslcol = desSheet.getLastColumn()
  var lastRow = lrowData.getLastRow();
  Logger.log('clearing the sheet')
  try {
    desSheet.getRange(1, 1, deslrow, deslcol).clear()
    Logger.log('Cleared')
  }
  catch (e) {
    Logger.log('nothing to clear')
  }
  Logger.log('getting values')

  var sourceData = SpreadsheetApp.openByUrl(spreadsheetUrl).getSheetByName(sSheet).getRange(range+lastRow).getValues();
  Logger.log('Pasting values')
  desSheet.getRange(1, 1, sourceData.length, sourceData[0].length).setValues(sourceData)
  Logger.log('Completed')
}
