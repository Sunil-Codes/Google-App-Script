function FormEditUrl(){



var mySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("your sheet name");  //add your sheet name of form responses.
var headers = mySheet.getRange(1, 1, 1, mySheet.getLastColumn()).getValues();
var Furl = headers[0].indexOf('Form edit Url');   //create an extra column header named 'Form edit Url'
var myContacts = mySheet.getDataRange();
var data = myContacts.getValues();
var lrow = mySheet.getLastRow();
var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl();
var formID = SpreadsheetApp.getActiveSpreadsheet().getFormUrl().match(/\/d\/(.{25,})\//)[1];
if (formID == '') { Browser.msgBox('No Form Found in this Sheet!'); return }
var form = FormApp.openById(formID);


for (var i = 1; i < lrow; i++) {
    if (data[i][0] != '' && data[i][Furl] == '') {
      var timestamp = data[i][0];
      var formSubmitted = form.getResponses(timestamp);
      if (formSubmitted.length < 1) { continue };
      var editResponseUrl = formSubmitted[0].getEditResponseUrl();
      Logger.log(editResponseUrl);
      var shorturl = tinyurl_getShortLink(editResponseUrl)
      mySheet.getRange(i + 1, Furl + 1).setValue(shorturl);
    }
   
  }
}
// for link shortner

function tinyurl_getShortLink(url) {
  try {
    if (url == undefined) {
      throw 'url is empty or is not a valid url!'
    }
    let content = UrlFetchApp.fetch('https://tinyurl.com/api-create.php?url=' + encodeURI(url), { 'muteHttpExceptions': true });
    if (content.getResponseCode() != 200) {
      return 'An error occured: [ ' + content.getContentText() + ' ]';
    }
    return content.getContentText();
  } catch (e) {
    return '';
  }
}
