// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
module.exports.sendAlert = async (title, message, action) => {
    const alert = new Alert();
    alert.title = title;
    alert.message = message;
    alert.addAction(action);
    await alert.presentAlert();
};