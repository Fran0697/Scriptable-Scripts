// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const main = async () => {
  const exchangeRateEndpoint = 'https://www.sucursalelectronica.com/exchangerate/showXmlExchangeRate.do';

  const exchangeRate = await getExchangeRate(exchangeRateEndpoint);
  const formattedExchangeRate = formatExchangeRate(exchangeRate);
  const output = generateOutput(formattedExchangeRate);
  Script.setShortcutOutput(output);
};

const getExchangeRate = async (exchangeRateEndpoint) => {
  const response = await fetchExchangeRate(exchangeRateEndpoint);
  const cleanedResponse = cleanXmlString(response);
  return extractCostaRicaBuyRate(cleanedResponse);
};

const fetchExchangeRate = async (exchangeRateEndpoint) => {
  return await new Request(exchangeRateEndpoint).loadString();
};

const cleanXmlString = (xmlString) => xmlString.replace(/\s/g, '');

const extractCostaRicaBuyRate = (xmlResponse) => {
  const regex = /<country>\s*<name>CostaRica<\/name>\s*<buyRateUSD>([^<]+)<\/buyRateUSD>/;
  const match = xmlResponse.match(regex);
  return match ? match[1] : null;
};

const formatExchangeRate = (exchangeRate) => parseFloat(exchangeRate).toFixed(2);

const generateOutput = (formattedExchangeRate) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const periodOfDay = currentHour < 12 ? 'abrió' : 'cerró';
  return `🐧Hola🦄 El tipo de cambio ${periodOfDay} hoy en ${formattedExchangeRate}`;
};

await main();
