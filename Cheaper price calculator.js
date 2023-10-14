// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: terminal;
const properties = importModule('CheaperPriceCalculatorProperties');
const fileService = importModule('FileService');
const httpService = importModule('HttpService');
const csvService = importModule('CsvService');
const emailService = importModule('EmailService');

const main = async () => {
  const { PRODUCT_FILE_NAME, OUTPUT_FILE_NAME, CSV_HEADER, KEYS,
    PRICE_REGEX, EMAIL_SUBJECT, EMAIL_BODY, EMAIL_RECIPIENTS, EMAIL_SENDER } = properties;

  const csvPath = fileService.getFilePath(PRODUCT_FILE_NAME);
  const csv = fileService.readFileAsString(csvPath);
  const productList = csvService.convertCsvToObject(csv);
  const pricePromises = productList.map(product => getPriceFromStores(product, KEYS, PRICE_REGEX));
  const allPrices = await Promise.all(pricePromises);

  const csvLines = allPrices.map((prices, index) => {
    const product = productList[index];
    const minPriceStores = findStoresWithMinPrice(prices);
    const storeNames = minPriceStores.map(store => store.store).join(' y ');
    return `${product.producto},${storeNames},${minPriceStores[0].price}`;
  });

  const csvOutput = [CSV_HEADER, ...csvLines].join('\n');

  const outputFilePath = fileService.writeFileFromString(OUTPUT_FILE_NAME, csvOutput);

  await emailService.sendEmailWithAttachments(
    EMAIL_SUBJECT,
    EMAIL_BODY,
    EMAIL_SENDER,
    EMAIL_RECIPIENTS,
    [outputFilePath]);
};

const getPriceFromStores = async (product, keys, priceRegex) => {
  const storeLinks = Object.keys(keys).map(key => ({
    key,
    link: product[`link${key}`],
    regex: priceRegex[key],
  }));

  const results = await Promise.allSettled(
    storeLinks.filter(store => store.link).map(async (store) => {
      try {
        const price = await getStorePrice(store.link, store.regex);
        return { store: store.key, price };
      } catch (error) {
        return { store: store.key, price: 0 };
      }
    })
  );

  return results;
};

const findStoresWithMinPrice = (prices) => {
  const fulfilled = 'fulfilled';
  const resolvedPrices = prices
    .filter(result => result.status === fulfilled && result.value.price !== 0)
    .map(result => result.value);

  if (resolvedPrices.length === 0) {
    return [{ store: 'Agotado', price: 0 }];
  }
  const minPrice = Math.min(...resolvedPrices.map(item => item.price));
  return resolvedPrices.filter(item => item.price === minPrice);
};

const getStorePrice = async (link, regex) => {
  const htmlData = await httpService.fetchDataAsString(link);
  return extractPrice(htmlData, regex);
};

const extractPrice = (htmlData, regex) => {
  const priceMatch = htmlData.match(regex);
  return priceMatch ? Math.floor(priceMatch[1].trim().replace(/,/g, '')) : 0;
};

await main();