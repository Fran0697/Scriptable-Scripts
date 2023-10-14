// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
module.exports.getFilePath = (fileName) => {
  try {
    if (!fileName || fileName.trim() === '') {
      throw new Error('File name cannot be null or empty.');
    }

    const fileManager = FileManager.iCloud();
    return fileManager.joinPath(fileManager.documentsDirectory(), fileName);
  } catch (error) {
    console.log(`Error in getFilePath: ${error}`);
    return null;
  }
};

module.exports.readFileAsString = (filePath) => {
  try {
    if (!filePath || filePath.trim() === '') {
      throw new Error('File path cannot be null or empty.');
    }

    const fileManager = FileManager.iCloud();
    return fileManager.readString(filePath);
  } catch (error) {
    console.log(`Error in readFileAsString: ${error}`);
    return null;
  }
};

module.exports.writeFileFromString = (filePath, data) => {
  try {
    if (!filePath || filePath.trim() === '') {
      throw new Error('File path cannot be null or empty.');
    }

    const fileManager = FileManager.iCloud();
    const fullPath = fileManager.joinPath(fileManager.documentsDirectory(), filePath);

    if (data === null || data === undefined) {
      throw new Error('Data to write cannot be null or undefined.');
    }

    fileManager.writeString(fullPath, data);
    return fullPath;
  } catch (error) {
    console.log(`Error in writeFileFromString: ${error}`);
    return null;
  }
};
