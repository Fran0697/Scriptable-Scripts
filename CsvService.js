// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
module.exports.convertCsvToObject = (csvString) => {
  const csvLines = csvString.trim().split('\n');
  const csvHeader = csvLines.shift().split(',');
  return csvLines.map((line) => {
    const values = line.split(',');
    const csvObject = {};
    for (let index = 0; index < csvHeader.length; index++) {
      csvObject[csvHeader[index]] = values[index];
    }
    return csvObject;
  });
};