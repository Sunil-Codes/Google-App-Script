function Create_PDF_Files() {
  var dS = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('your sheet we will pull data')     // no need to change the data sheet
  var doc = DocumentApp.openById('doc Id which you want to make pdf') // do not change this is a template file
  var folder = DriveApp.getFolderById(your folder id where the pdf will be saved)  // set the folder ID where file will save

  var dsr = dS.getDataRange().getValues();


  for (var x = 1; x <dsr.length; x++) {
    if(dS.getRange(x+1,7).getValue()==='x') continue; //----------- change this to if change the column order
    var copy = DriveApp.getFileById(doc.getId()).makeCopy(folder);

    var new_doc = DocumentApp.openById(copy.getId())
    new_doc.setName(x)

    var New_body = new_doc.getBody();

    var db = dsr[x][1];   // these are the fields which will be pushed in the doc we can add more like this
    var tgt = dsr[x][2];  // these are the fields which will be pushed in the doc we can add more like this
    var tgt2 = dsr[x][3]; // these are the fields which will be pushed in the doc we can add more like this
    var inta = dsr[x][4]; // these are the fields which will be pushed in the doc we can add more like this
    var inta2 = dsr[x][5]; // these are the fields which will be pushed in the doc we can add more like this
   

Logger.log(db)

    New_body.replaceText('<<Distributor>>', db)            //replacing the variable with the actual value
    New_body.replaceText('<<Targets>>', tgt)               //replacing the variable with the actual value
    New_body.replaceText('<<Targets 2>>', tgt2)            //replacing the variable with the actual value
    New_body.replaceText('<<Incentive Amount>>', inta)     //replacing the variable with the actual value
    New_body.replaceText('<<Incentive Amount 2>>', inta2)  //replacing the variable with the actual value
  
    

    new_doc.saveAndClose();


    Logger.log(new_doc.getId())
    SpreadsheetApp.flush()
    Logger.log('creating pDF')
    var pdf = new_doc.getBlob().getAs('application/pdf');

    var pdfFile = folder.createFile(pdf)    // creating file in folder
        pdfFile.setName(db)
        var pdfURL = pdfFile.getUrl()
        dS.getRange(x+1,7).setValue('x')
        dS.getRange(x+1,8).setValue(pdfURL)
        


    DriveApp.getFileById(new_doc.getId()).setTrashed(true)  //deleting the copy file


  }

}
