function CreatePDFslide() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Receipts')
  var docid = '19D29OoF3i65DsPxhXfKtD4zOM7LGFAfrP19P9cw66SA'
  var page = SlidesApp.openById(docid).getSlides()[0].getObjectId();
  var folder = DriveApp.getFolderById('1tq_yaFGRk4vlLMP8Lz7HamCPC_ziEPKZ')

  var data = ss.getDataRange().getDisplayValues()
  data.shift()

  data.forEach((r, i) => {
    if (r[7] !== '') return
    var mobile = r[4]
    var name = r[3]
    var inWords = r[5]
    var amount = r[6]
    var Rno = r[0]

    var copy = DriveApp.getFileById(docid).makeCopy(folder)
    var new_doc = SlidesApp.openById(copy.getId())

    var body = new_doc.getSlides()[0]

    body.replaceAllText('{{Name}}', name)
    body.replaceAllText('{{mobile}}', mobile)
    body.replaceAllText('{{inwords}}', inWords)
    body.replaceAllText('{{Amount}}', amount)
    body.replaceAllText('{{R.no}}', Rno)

    new_doc.saveAndClose()
  
    var pdf = copy.getAs('application/pdf');
    var pdfFile = folder.createFile(pdf)
    pdfFile.setName(`${name}'s Receipt`)
    var pdfUrl = pdfFile.getUrl()

    ss.getRange(i + 2, 8).setValue(pdfUrl)

    copy.setTrashed(true)



  })


}
