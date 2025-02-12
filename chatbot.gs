var apiUrl = "https://api.green-api.com";
var idInstance = "7103924464";
var apiTokenInstance = "cd2936365472428b9009f6fe865f6dcff911c490bcd54a5c80";

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('incoming Messages')

  } catch (err) {
    ss.appendRow(err)
  }
}
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('incoming Messages');
  try {
    var data = JSON.parse(e.postData.contents);
    // ss.appendRow([JSON.stringify(data)])
    // ss.appendRow([JSON.stringify(data)])
    incomingMsg(data)
    var response = ContentService.createTextOutput("Success");
    response.setMimeType(ContentService.MimeType.TEXT);
    return response;
  } catch (err) {
    ss.appendRow([err])
  }
}


function incomingMsg(data) {
 try{
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('incoming Messages');
  var instanceData = data.instanceData;
  var recmsg = ''
  var messageData = data.messageData;
  var fileMessageData = messageData.fileMessageData;
  var textmessagedata = messageData.textMessageData;
  var extendedTextMessageData = messageData.extendedTextMessageData;
  // var text = extendedTextMessageData.text || '';
  if (fileMessageData && fileMessageData.caption !== undefined) {
    recmsg = fileMessageData.caption;
  } else if (extendedTextMessageData && extendedTextMessageData.text !== undefined) {
    recmsg = extendedTextMessageData.text
  } else if (textmessagedata && textmessagedata.textMessage !== undefined) {
    recmsg = textmessagedata.textMessage
  } else {
    recmsg = ''
  }
  // sheet.appendRow([caption])
  var senderData = data.senderData;
  var idMessage = data.idMessage;
  var chatId = senderData.chatId;
  var matchMsg = ''
  var reply = 'Not Opted'

  var opt = optIn(chatId)
  if (recmsg.length === 0|| chatId.includes('@g.us')) return
  if (opt) {
    
     matchMsg = calculateKeywordMatch(recmsg)
     reply = findResponseUsingFind(matchMsg.keyword)
    if (matchMsg.matchPercentage > 72) {
      var id = sendText(chatId, reply, idMessage)
    } else {
      sendText(chatId, 'Apologies, No Record found on the bases of your prompt be specific', idMessage)
    }
  }


  var timestamp = convertTimestampToIST(data.timestamp);

  var chatName = senderData.chatName;
  var sender = senderData.sender;
  var senderName = senderData.senderName;
  var senderContactName = senderData.senderContactName;

  var typeMessage = messageData.typeMessage;


  // var jpegThumbnail = fileMessageData && fileMessageData.jpegThumbnail !== undefined ? fileMessageData.jpegThumbnail : '';
  // var isAnimated = fileMessageData && fileMessageData.isAnimated !== undefined ? fileMessageData.isAnimated : '';
  // var forwardingScore = fileMessageData && fileMessageData.forwardingScore !== undefined ? fileMessageData.forwardingScore : '';
  // var isForwarded = fileMessageData && fileMessageData.isForwarded !== undefined ? fileMessageData.isForwarded : '';





  sheet.appendRow([timestamp, idMessage, chatId, chatName, sender, senderName, senderContactName, typeMessage, recmsg, reply, matchMsg.matchPercentage]);

}catch(err){
  sheet.appendRow([err,JSON.stringify(data)])
}
}




function convertTimestampToIST(timestamp) {
  // Convert the timestamp (in seconds) to milliseconds
  let date = new Date(timestamp * 1000);
  // Format the date in IST (India Standard Time)
  // Use Utilities.formatDate to convert to IST
  let formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
  return formattedDate;
}




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

function findResponseUsingFind(jsonResponse) {
  // Open the active spreadsheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prompts')

  // Get all values in Columns A and B (assuming data starts at row 1)
  const data = sheet.getRange(1, 1, sheet.getLastRow(), 2).getDisplayValues()

  // Use Array.prototype.find() to get the row where the first column matches jsonResponse
  const matchingRow = data.find(row => row[0].toLowerCase() === jsonResponse.toLowerCase());

  // Return the corresponding value from Column B, or a default message if not found
  // Logger.log(matchingRow ? matchingRow[1] : "No matching response found")
  return matchingRow ? matchingRow[1] : "No matching response found";
}

// var typeWebhook = data.typeWebhook;
// var idInstance = instanceData.idInstance;
// var wid = instanceData.wid;
// var fileName = fileMessageData && fileMessageData.fileName !== undefined ? fileMessageData.fileName : '';
// var typeInstance = instanceData.typeInstance;
// var downloadUrl = fileMessageData && fileMessageData.downloadUrl !== undefined ? fileMessageData.downloadUrl : '';
// var mimeType = fileMessageData && fileMessageData.mimeType !== undefined ? fileMessageData.mimeType : '';





function optIn(no) {
  var settingSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('optIn');
  var optData = settingSheet.getRange(2, 3, settingSheet.getLastRow(), 1).getValues(); // -1 for proper row range

  for (var i = 0; i < optData.length; i++) {
    if (no == "91"+optData[i][0]+"@c.us") {  // optData[i][0] to access the first element of the row
      Logger.log(true);
      return true;  // Return true and exit the function
    }
  }

  Logger.log(false);
  return false;  // Return false if no match is found
}


function welcomeMsg(){
  var settingSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('optIn');
  var data = settingSheet.getDataRange().getValues();
  data.shift()
  data.forEach((r,i)=>{
     var status = data[i][4]
    
     if(status) return

    var msg = "Hello " + data[i][1] + ", 👋\n\nThank you for joining our WhatsApp-based chatbot service! 🎉 We’re excited to have you on board and help make accessing company information easier and faster.\n\nHere are a few prompts you can try right away:\n\nType 'Leave Application' to get the link for applying for leave 📝\nType 'HR Policy' to quickly access the latest HR guidelines 📜\nType 'Wifi to see all the available networks\nType what is mojito bar syrup 12x1L current stock\n\nThese are just a few examples! Feel free to explore and send any queries. Your inputs will help us improve and make the chatbot smarter over time. 🚀\n\nStay tuned for more updates, including real-time data features in the future! 💡\n\nThank you for being part of this!" 


     Logger.log(msg)
     sendText("91"+data[i][2]+"@c.us",msg)
     settingSheet.getRange(i+2,5).setValue('Sent')

     
  })


}










function calculateKeywordMatch(userInput) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prompts');
  var ss = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();

  // Flatten the 2D array into a 1D array for keywords
  var keywords = ss.map(function(row) {
    return row[0].toLowerCase();
  });

  userInput = userInput.toLowerCase(); // Convert input to lowercase for comparison
  var bestMatch = { keyword: '', matchPercentage: 0 }; // To store the best match

  for (var i = 0; i < keywords.length; i++) {
    var keyword = keywords[i];
    var similarity = calculateStringSimilarity(userInput, keyword);

    // If we find a better match, update the bestMatch object
    if (similarity > bestMatch.matchPercentage) {
      bestMatch = { keyword: keyword, matchPercentage: similarity };
    }
  }

  // Return the best match and its percentage
  Logger.log(bestMatch)
  return bestMatch;
}

// Levenshtein distance to calculate similarity between two strings
function calculateStringSimilarity(str1, str2) {
  var distance = levenshtein(str1, str2);
  var maxLength = Math.max(str1.length, str2.length);
  
  // Calculate percentage similarity (higher value means better match)
  var similarityPercentage = ((maxLength - distance) / maxLength) * 100;
  return similarityPercentage;
}

// Levenshtein distance function
function levenshtein(a, b) {
  if (a.length == 0) return b.length;
  if (b.length == 0) return a.length;
  var matrix = [];

  // increment along the first column of each row
  for (var i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  for (var j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (var i = 1; i <= b.length; i++) {
    for (var j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

















































