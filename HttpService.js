// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
module.exports.fetchDataAsString = async (link) => {
  if (!link) {
    throw new Error('Link cannot be null.');
  }

  try {
    const response = await new Request(link).loadString();

    if (response === null || response.trim() === '') {
      throw new Error(`Empty response from ${link}.`);
    }

    return response;
  } catch (error) {
    throw new Error(`Error fetching data from ${link}: ${error.message}`);
  }
};