function sendTextFile(file, phone, msg, quotedMessageId) {
  // var file = 'https://drive.google.com/file/d/1VHw6ySVt063Pj3WJ6ObggViFZSGK_do8/view?usp=drive_link';
  var fileName = ""; // Initialize fileName variable

  if (isGoogleDriveURL(file)) {
    var fileID = /(?:\/d\/|id=)([\w-]+)/.exec(file);

    fileID = fileID[1]; // Extract file ID from the regex match
    var drive = DriveApp.getFileById(fileID).getBlob();
    var contentType = drive.getContentType();
    fileName = drive.getName(); // Assign fileName

    if (contentType != "image/jpeg") {
      file = uploadFile(fileID, contentType);
    } else {
      file = driveLink + fileID;
    }
  }
  var payloadFile = {
    chatId: phone,
    urlFile: file,
    fileName: fileName,
    caption: msg,
    quotedMessageId: "",
  };
  var urlfile =
    apiUrl + "/waInstance" + idInstance + "/sendFileByUrl/" + apiTokenInstance;
  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payloadFile),
    muteHttpExceptions: true,
  };
  var response = UrlFetchApp.fetch(urlfile, options);
  var parse = JSON.parse(response);

  return parse.idMessage;
}




// to send only text

function sendText(phone, msg, quotedMessageId) {
  var urlText = apiUrl + "/waInstance" + idInstance + "/sendMessage/" + apiTokenInstance;
  var payloadText = {
    chatId: phone,
    message: msg,
    quotedMessageId: quotedMessageId,
    linkPreview: true
  };


  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payloadText),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(urlText, options);
  var parse = JSON.parse(response)

  return parse.idMessage
}



// upload file to their server and return link

function uploadFile(fileID, contentType) {


  var url = "https://media.greenapi.com/waInstance" + idInstance + "/uploadFile/" + apiTokenInstance;
  var file = DriveApp.getFileById(fileID).getBlob().getBytes()
  var headers = {
    'Content-Type': contentType
  };

  var options = {
    'method': 'post',
    'headers': headers,
    'payload': file // Assuming you pass the file contents directly
  };

  var response = UrlFetchApp.fetch(url, options);
  var link = JSON.parse(response)
  return link.urlFile
}

// Get contacts of connected phone number


function getContacts() {
  var searchText = 'Trouble'
  var urlfile = apiUrl + "/waInstance" + idInstance + "/getContacts/" + apiTokenInstance;
  var responseData = JSON.parse(UrlFetchApp.fetch(urlfile))
  var filteredContacts = responseData.filter(contact => contact.name.toLowerCase().includes(searchText.toLowerCase()))
    .map(contact => {
      Logger.log(contact);
      return contact; // Include this line if you want to maintain the filtered array
    });


}



// to handle if the file link is google drive or not
function isGoogleDriveURL(file) {
  return /docs\.google\.com|drive\.google\.com/.test(url);
}