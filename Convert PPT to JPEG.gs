function convertJpeg(folderId, id, name) {

  // here you can replace the variable in the ppt to send the customized jpeg to someone
  // id is slide id
  // const folderId = "1-_I0VOzTcrZy-SVAXSU1E9FqpY"; // Please set the folder ID you want to put the exported PDF files.
  // name is the variable which you want to replace in the ppt.


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
