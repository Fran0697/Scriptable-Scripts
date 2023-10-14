// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: cogs;
module.exports.getContactPhoneNumber = async (contactName) => {
  const containers = await ContactsContainer.all();
  const contacts = await Contact.all(containers);

  const matchingContacts = contacts.filter(contact =>
    contact.givenName.includes(contactName)
  );

  return matchingContacts.length > 0
    ? matchingContacts[0].phoneNumbers.map(phone => phone.value)
    : [];
}