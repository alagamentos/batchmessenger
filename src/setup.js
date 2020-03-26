const fs = require('fs')
const csv = require('csv-parser')
const { Database } = require('sqlite3')
const { getAllContacts, insertContact } = require('./database')

console.log('Inicializando a configuração do banco de dados de contatos...')

if (fs.existsSync('app.db')) {
  fs.unlinkSync('app.db')
}

const db = new Database('app.db')

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(100) NOT NULL,
      phone CHAR(14) UNIQUE NOT NULL
    )`
  )

  if (!fs.existsSync('contacts.csv')) {
    console.warn('ALERTA: O arquivo "contacts.csv" não foi encontrado na pasta raiz do projeto.')
    console.log('Configuração do banco de dados de contatos concluída com sucesso.')
    return
  }

  fs.createReadStream('contacts.csv')
    .pipe(csv({ separator: ',' }))
    .on('data', (data) => {
      const name = data.Name
      const phones = data['Phone 1 - Value']
                      .replace(/\s+/g, '')
                      .replace(/-+/g, '')
                      .replace(/\++/g, '')
                      .split(/:::+/g)

      if (name.length > 0 && phones.length > 0) {
        phones.forEach(phone => insertContact(db, { name, phone }))
      }
    })
    .on('end', () => {
      getAllContacts(db, (err, rows) => {
        if (err) {
          console.error(`ERRO: ${err}`)
          return
        }

        console.log(rows)
      })

      db.close((err) => {
        if (err) {
          console.error(`ERRO: ${err}`)
          return
        }

        console.log('Configuração do banco de dados de contatos concluída com sucesso.')
      })
    })
})
