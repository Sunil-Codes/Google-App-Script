function giveAllRights() {
  var editors = ['mis@solarsales.in','pc@solarsales.in','dme@solarsales.in']

  var ss = SpreadsheetApp.getActiveSpreadsheet()

  for (var i = 0; i < ss.getSheets().length; i++) {
    var sheet = ss.getSheets()
    sheet[i].protect().addEditors(editors)
    var protection = sheet[i].getProtections(SpreadsheetApp.ProtectionType.RANGE)

    for (var x = 0; x < protection.length; x++) {
      protection[x].addEditors(editors)
    }
  }
}
