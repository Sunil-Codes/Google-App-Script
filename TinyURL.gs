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
