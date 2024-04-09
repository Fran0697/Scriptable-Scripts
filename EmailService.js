// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
const sendEmail = async (subject, body, sender, recipients, filePaths = []) => {
  try {
    if (!subject || !body || !sender || !recipients.length) {
      throw new Error('Missing required parameters for sending email.');
    }

    const mail = new Mail();

    mail.subject = subject;
    mail.body = body;

    if (sender.includes('@')) {
      mail.preferedSendingEmailddress = sender;
    } else {
      throw new Error('Invalid sender email address.');
    }

    if (recipients.every(email => email.includes('@'))) {
      mail.toRecipients = recipients;
    } else {
      throw new Error('Invalid recipient email address.');
    }

    filePaths.filter(filePath => filePath).forEach(filePath => {
      mail.addFileAttachment(filePath);
    });

    await mail.send();
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

module.exports.sendEmail = sendEmail;

module.exports.sendEmailWithAttachments = async (subject, body, sender, recipients, filePaths) => {
  if (filePaths === null) {
    throw new Error('File paths cannot be null.');
  }
  await sendEmail(subject, body, sender, recipients, filePaths);
};
