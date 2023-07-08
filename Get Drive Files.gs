function GetFiles(){

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Your sheet name')
  sheet.getRange(1,1,1,4).setValues([['Name','Link','Owner','DateCreated']]); // these are the headers you want the detials of.

  while (content.hasNext()){
    var file =content.next()
    var name = file.getName()
    var link = file.getUrl()
    var owner = file.getOwner().getName()
    var dateCreated=file.getDateCreated()
    var FolderName= file.getParents()
    var FileType= file.getMimeType()
    sheet.appendRow([name,link,owner,dateCreated])
  
  }
Logger.log('data pushed in sheet')
}
