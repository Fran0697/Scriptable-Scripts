// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const inputService = importModule('InputService');
const alertService = importModule('AlertService');

const main = async () => {
  const potatoSize = await inputService.getNumberInput("Tamaño de la papa en gramos", "Ingresa el tamaño de la papa:", "gr", "Calcular", "Cancelar");
  if (potatoSize === null) {
    return;
  }
  const targetCalories = await inputService.getNumberInput("Cuantas calorias quieres comer?", "Ingresa las Kcal:", "kcal", "Ingresar", "Cancelar");
  if (targetCalories === null) {
    return;
  }
  const resultMessage = generateResultMessage(potatoSize, targetCalories);
  await alertService.sendAlert("Resultado", resultMessage, "OK");
};

const calculateButterAmount = (potatoSize) => {
  const butterRatio = 14 / 200; // 14g of butter for every 200g of potato
  return potatoSize * butterRatio;
};

const calculatePotatoAmount = (potatoSize, butterAmount, targetCalories) => {
  return (targetCalories * (potatoSize + butterAmount)) / getTotalCalories(potatoSize, butterAmount);
};

const getTotalCalories = (potatoSize, butterAmount) => {
  const potatoCaloriesPer100g = 88;
  const butterCaloriesPer14g = 101;
  const potatoTotalCalories = (potatoSize * potatoCaloriesPer100g) / 100;
  const butterTotalCalories = (butterAmount * butterCaloriesPer14g) / 14
  return potatoTotalCalories + butterTotalCalories
}

const generateResultMessage = (potatoSize, targetCalories) => {
  const butterAmount = calculateButterAmount(potatoSize);
  const potatoAmount = calculatePotatoAmount(potatoSize, butterAmount, targetCalories);
  return `Agrega ${butterAmount.toFixed(2)} gramos de mantequilla a tus ${potatoSize} gramos de papa.\n
  Puedes comer ${potatoAmount.toFixed(2)} gramos de papa para una porción equivalente a ${targetCalories}kcal.`;
};

await main();