// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const main = async () => {
  const targetCalories = 65;
  const potatoSize = await getPotatoSize();
  if (potatoSize !== null) {
    const resultMessage = displayResults(potatoSize, targetCalories);
    const alert = new Alert();
    alert.title = "Resultado";
    alert.message = resultMessage;
    alert.addAction("OK");
    await alert.presentAlert();
  }
};

const getPotatoSize = async () => {
  let inputAlert = new Alert();
  inputAlert.title = "Tamaño de la papa en gramos";
  inputAlert.message = "Ingresa el tamaño de la papa:";
  inputAlert.addTextField("Tamaño de la papa", "");
  inputAlert.addAction("Calcular");
  inputAlert.addCancelAction("Cancelar");
  let pressedButton = await inputAlert.presentAlert();
  if (pressedButton === -1) {
    return null;
  } else {
    return parseFloat(inputAlert.textFieldValue(0));
  }
};

const calculateButterAmount = (potatoSize) => {
  const butterRatio = 14 / 200; // 14g of butter for every 200g of potato
  return potatoSize * butterRatio;
};

const calculatePotatoAmount = (potatoSize, targetCalories) => {
  const potatoCaloriesPer100g = 88;
  const butterCaloriesPer14g = 101;
  const butterAmount = calculateButterAmount(potatoSize);
  const totalSize = potatoSize + butterAmount;
  const potatoTotalCalories = (potatoSize * potatoCaloriesPer100g) / 100;
  const butterTotalCalories = (butterAmount * butterCaloriesPer14g) / 14
  const totalCalories = potatoTotalCalories + butterTotalCalories
  return (targetCalories * totalSize) / totalCalories;
};

const displayResults = (potatoSize, targetCalories) => {
  const butterAmount = calculateButterAmount(potatoSize);
  const potatoAmount = calculatePotatoAmount(potatoSize, targetCalories);
  return `Agrega ${butterAmount.toFixed(2)} gramos de mantequilla a tus ${potatoSize} gramos de papa.\n
  Puedes comer ${potatoAmount.toFixed(2)} gramos de papa para una porción equivalente a ${targetCalories}kcal.`;
};

await main();