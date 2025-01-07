function Bulk_EmailNewsletters() {
  var wb = SpreadsheetApp.getActiveSpreadsheet();
  var ss = wb.getSheetByName('Newsletter');
  // var msg= ss.getRange(4, 7).getValue();
  // var subject = ss.getRange(3, 7).getValue();
  var lrow = ss.getLastRow()
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Do you want to send mail to ' + (lrow - 1) + ' People ', ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
    for (var x = 2; x <= lrow; x++) {
      var status = ss.getRange(x, 3).getValue();
      Logger.log(ss.getRange(x, 3).getValue())
      if (status !== '') {
        continue; // Skip to the next iteration of the loop
      }

      var recipient = ss.getRange(x, 2).getValue();


      sendEmailWithImages(recipient)

      ss.getRange(x, 3).setValue('Sent')



    }
  }
}



















function sendEmailWithImages(recipient) {
  // Define recipient and subject
  // const recipient = "ea@solarsales.in";
  var subject = "Food Service Industry Growing at 9% CAGR. Unlock 🔓 your 15 % growth formula";
    subject = `=?UTF-8?B?${Utilities.base64Encode(Utilities.newBlob(subject).getBytes())}?=`;

  // Google Drive file IDs for the images
  const image1Id = "1TZdk7L6Vo-AnZqU1S7TRpjqrbgx8i_Ti";
  const image2Id = "1SPRG949nG-doQKVlm4sT2_3ZwpFy1CVF";
  const image3Id = "1Ps1BldYUvnKHmkdkhZhQDXLxFCvX2qEL";

  // Get image blobs
  const image1Blob = DriveApp.getFileById(image1Id).getBlob();
  const image2Blob = DriveApp.getFileById(image2Id).getBlob();
  const image3Blob = DriveApp.getFileById(image3Id).getBlob();

  // Create inline image content
  const inlineImages = {
    image1: image1Blob,
    image2: image2Blob,
    image3: image3Blob,
  };

  // HTML email body
  var htmlBody = `
     <html>
      <body>
        <img src="cid:image1" alt="Image 1" style="width: 90%; display: block; margin: auto;" />
        <br>
        <img src="cid:image2" alt="Image 2" style="width: 90%; display: block; margin: auto;" />
        <br>
        <img src="cid:image3" alt="Image 3" style="width: 90%; display: block; margin: auto;" />
        <br>
       <table style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.5; width: 100%;">
  <tr>
    <td>
      <strong>Regards,</strong><br>
      <strong>Shubham Jain</strong><br>
      <span>Director - Sales and Marketing</span><br>
      <span>
        📞 Mob: 
        <a href="tel:+918882924026" style="text-decoration: none; color: #0073e6;">+91-8882924026</a> / 
        <a href="tel:+919811443081" style="text-decoration: none; color: #0073e6;">+91-9811443081</a>
      </span><br><br>
      
      <a href="https://www.linkedin.com/in/shubhampcj/" target="_blank" style="text-decoration: none; color: #0073e6; font-weight: bold;">
        Connect on LinkedIn
      </a>
      
      <br><br>
      <div style="font-family: Arial, sans-serif; font-size: 14px;">
        <a href="https://zonesyrups.com" target="_blank" style="text-decoration: none; color: #0073e6; font-weight: bold;">PCJ Group</a> | 
        <a href="https://www.youtube.com/channel/UCe_C5K1f2OVARZ8QOpvilOA" target="_blank" style="text-decoration: none; color: #0073e6; font-weight: bold;">YouTube - Zone</a> | 
        <a href="https://www.instagram.com/zonesyrups/" target="_blank" style="text-decoration: none; color: #0073e6; font-weight: bold;">Instagram - Zone</a> | 
        <a href="https://www.youtube.com/channel/UCPJN7gYXKQyOlfLMg3Gen3Q" target="_blank" style="text-decoration: none; color: #0073e6; font-weight: bold;">YouTube - Solar</a> | 
        <a href="https://www.instagram.com/solarsalesindia/" target="_blank" style="text-decoration: none; color: #0073e6; font-weight: bold;">Instagram - Solar</a>
      </div>

      <br><br>
      <span style="font-size: 12px; color: #666;">
        *********************************************************************************************************<br>
        This communication is for the exclusive use of the intended recipient(s) and shall not attach any liability 
        on the originator or Puranchand Jain and Sons Pvt Ltd, its subsidiaries/its group companies. If you are the 
        addressee, the contents of this email are intended for your use only and it shall not be forwarded to any 
        third party without first obtaining written authorization from the originator or Puranchand Jain and Sons 
        Pvt Ltd, its subsidiaries/its group companies. It may contain information which is confidential and legally 
        privileged, and the same shall not be used or dealt with by any third party in any manner whatsoever without 
        the specific consent of Puranchand Jain and Sons Pvt Ltd, its subsidiaries/its group companies.<br>
        *********************************************************************************************************
      </span>
    </td>
  </tr>
</table>


      </body>
    </html>
  `;

  // Send the email
  htmlBody = convertEmojisToHTMLEntities(htmlBody)
  GmailApp.sendEmail(recipient, subject, "", {
    htmlBody: htmlBody,
    inlineImages: inlineImages,
    charset: 'UTF-8'
  });

  Logger.log("Email sent successfully!");
}




function convertEmojisToHTMLEntities(text) {
  return text.replace(/\p{Extended_Pictographic}/gu, match => {
    return `&#${match.codePointAt(0)};`;
  });
}
