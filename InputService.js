// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
module.exports.getNumberInput = async (title, message, textField, action, cancelAction) => {
    let firstFail = false;

  while (true) {
    let inputAlert = new Alert();
    inputAlert.title = title;
    inputAlert.message = firstFail ? `${message}\nEl valor es obligatorio y debe ser numérico.` : message;
    inputAlert.addTextField(textField, "");
    inputAlert.addAction(action);
    inputAlert.addCancelAction(cancelAction);
    
    let pressedButton = await inputAlert.presentAlert();
    
    if (pressedButton === -1) {
      return null;
    } else {
      let input = parseFloat(inputAlert.textFieldValue(0));
      if (!isNaN(input)) {
        return input;
      }
      firstFail = true;
    }
  }
};