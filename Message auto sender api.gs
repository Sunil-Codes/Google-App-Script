var mas_apiKey = '';

//or 

var mas_username = 'your username';
var mas_password = 'your password';




const sendMessage = (receivers, textMessages, filesUrls) => {
  let messages = [].concat(textMessages || []);
  let urls = [].concat(filesUrls || []);
  let rawReceivers = [].concat(receivers || []);

  let receiverIds = rawReceivers.filter((item) => item.endsWith('@c.us') || item.endsWith('@g.us'));
  let receiverNumbers = rawReceivers.filter((item) => !receiverIds.includes(item));

  let driveFiles = urls.filter((filePath) => filePath.indexOf('drive.google.com') !== -1 || filePath.indexOf('docs.google.com') !== -1);
  let nonDriveFiles = urls.filter((filePath) => !driveFiles.includes(filePath));

  let messageBody = {
    receiverMobileNo: receiverNumbers.join(","),
    recipientIds: receiverIds,
    message: messages,
    filePathUrl: nonDriveFiles,
    base64File: driveFiles.map((url) => getGoogleFileAsBase64(url)),
  };
  let options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      ...mas_password && { 'Authorization': 'Basic ' + Utilities.base64Encode(mas_username + ':' + mas_password, Utilities.Charset.UTF_8) },
      ...mas_apiKey && { 'x-api-key': mas_apiKey }
    },
    payload: JSON.stringify(messageBody)
  };
  try {
    Logger.log('Sending message...')
    var sendNow = UrlFetchApp.fetch("https://app.messageautosender.com/api/v1/message/create", options);
    Logger.log('Response is', sendNow)
    return true;
  } catch (e) {
    Logger.log(e);
    return false;
  }
};

const getDriveFileIdFromUrl = (url) => url.match(/[-\w]{25,}/);

const getGoogleFileAsBase64 = (url) => {
  let returnValue = {}
  if (url.indexOf('docs.google.com') !== -1) {
    let file = DocumentApp.openById(getDriveFileIdFromUrl(url));
    returnValue = {
      name: file.getName().replace(/\.[^/.]+$/, '') + '.pdf',
      body: Utilities.base64Encode(file.getAs('application/pdf').getBytes())
    };
  } else if (url.indexOf('drive.google.com') !== -1) {
    let file = DriveApp.getFileById(getDriveFileIdFromUrl(url));
    returnValue = {
      name: file.getName(),
      body: Utilities.base64Encode(file.getBlob().getBytes())
    }
  }
  return returnValue;
}





function convertJpeg(folderId, id, name) {
  // const folderId = "1-_I0VOzTcrZy-SVYwbMKfAXSU1E9FqpY"; // Please set the folder ID you want to put the exported PDF files.

  // 1. Retrieve all slides from the source Google Slides.

  // const id = '11hTgSGFVgCuzHPiW8Z1zuyaOiaTq4JiiFrRfpQJZrBM';

  var page = SlidesApp.openById(id).getSlides()[0].getObjectId();
  // 2. Export each page as a JPEG file.
  const folder = DriveApp.getFolderById(folderId);

  var newfile = DriveApp.getFileById(id).makeCopy();
  newfile.moveTo(DriveApp.getFolderById(folderId));

  SlidesApp.openById(newfile.getId()).getSlides()[0].replaceAllText('{Name}', name.toUpperCase());

  SlidesApp.openById(newfile.getId()).saveAndClose();

  const url = Slides.Presentations.Pages.getThumbnail(newfile.getId(), page, { "thumbnailProperties.mimeType": "PNG" }).contentUrl;
  const blob = UrlFetchApp.fetch(url).getAs(MimeType.JPEG);
  var jpeg = folder.createFile(blob.setName('file.jpg'));
  var link = jpeg.getUrl();

  DriveApp.getFileById(jpeg.getId()).setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW)



  DriveApp.getFileById(newfile.getId()).setTrashed(true);
  return jpeg
}
