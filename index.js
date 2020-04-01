((csvFilename, callback, csvSeparator = ',') => {
  const fs = require('fs')
  const csv = require('csv-parser')

  const contacts = []

  if (!fs.existsSync(csvFilename)) {
    console.warn('ALERTA: O arquivo "contacts.csv" não foi encontrado na pasta raiz do projeto.')
    return callback(contacts)
  }

  fs.createReadStream(csvFilename)
    .pipe(csv({ separator: csvSeparator }))
    .on('data', (data) => {
      const name = data.Name
      const phones = data['Phone 1 - Value']
        .replace(/\s+/g, '')
        .replace(/-+/g, '')
        .replace(/\++/g, '')
        .replace(/\(+/g, '')
        .replace(/\)+/g, '')
        .replace(/\.+/g, '')
        .split(/:::+/g)

      if (name.length > 0 && phones.length > 0) {
        phones.forEach(phone => {
          if (/^[0-9]{8,}$/.test(phone) && !contacts.some(contact => contact.phone === phone)) {
            contacts.push({ id: contacts.length + 1, name, phone })
          }
        })
      }
    })
    .on('end', () => {
      console.log(contacts)
      callback(contacts)
    })
})('contacts.csv', require('./src/app'))
