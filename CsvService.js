// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
module.exports.convertCsvToObject = (csvString) => {
  const csvLines = csvString.trim().split('\n');
  const csvHeader = csvLines.shift().split(',');
  return csvLines.map((line) => {
    const values = line.split(',');
    return values.reduce((csvObject, value, index) => {
      csvObject[csvHeader[index]] = value;
      return csvObject;
    }, {});
  });
};